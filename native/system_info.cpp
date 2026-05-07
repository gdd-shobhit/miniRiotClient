/**
 *
 * Phase 3: C++ native addon using node-addon-api (N-API C++ wrapper).
 *
 * CPU measurement strategy — stateful delta approach:
 *   Windows GetSystemTimes() returns cumulative kernel/user/idle time since boot.
 *   CPU % = (active delta / total delta) over a time window.
 *   We store the previous reading in a static and compute the delta on every call.
 *   First call returns 0% CPU (no previous reading to diff against).
 *   Since main calls getSystemInfo() every 2 seconds, subsequent reads measure
 *   CPU usage over that 2-second window — no Sleep(), no blocked thread.
 *   The polling interval IS the measurement window. Clean design.
 *
 * Windows APIs used:
 *   GetSystemTimes()       — CPU kernel / user / idle time counters
 *   GlobalMemoryStatusEx() — physical RAM total / available
 *   GetTickCount64()       — milliseconds since system boot (uptime)
 *
 * Analogy to your C++ background:
 *   Napi::Function::New<fn>(env) ≈ binding a delegate to a callable slot.
 *   Napi::Object::Set()          ≈ setting fields on a UStruct before returning it.
 */

#include <napi.h>

#ifdef _WIN32
  #include <windows.h>
#else
  #include <ctime>
#endif

// ── Helpers ─────────────────────────────────────────────────────────────────

#ifdef _WIN32
static inline unsigned long long FileTimeToULL(const FILETIME& ft) {
    return (static_cast<unsigned long long>(ft.dwHighDateTime) << 32)
         | static_cast<unsigned long long>(ft.dwLowDateTime);
}
#endif

// CPU previous readings between calls to compute the delta 
#ifdef _WIN32
static FILETIME s_prevIdle   = {};
static FILETIME s_prevKernel = {};
static FILETIME s_prevUser   = {};
#endif
static bool s_cpuInitialized = false;

/**
 *   getSystemInfo() -> { cpu, memoryUsed, memoryTotal, uptime }
 *
 *   cpu         — CPU usage percentage (0–100), computed as delta since last call
 *   memoryUsed  — Used RAM in GB
 *   memoryTotal — Total RAM in GB
 *   uptime      — System uptime in hours
 */
static Napi::Value GetSystemInfo(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Object result = Napi::Object::New(env);

    double cpu         = 0.0;
    double memUsedGB   = 0.0;
    double memTotalGB  = 0.0;
    double uptimeHours = 0.0;

#ifdef _WIN32
    // CPU 
    FILETIME idle, kernel, user;
    if (GetSystemTimes(&idle, &kernel, &user)) {
        if (s_cpuInitialized) {
            unsigned long long idleDelta   = FileTimeToULL(idle)   - FileTimeToULL(s_prevIdle);
            unsigned long long kernelDelta = FileTimeToULL(kernel) - FileTimeToULL(s_prevKernel);
            unsigned long long userDelta   = FileTimeToULL(user)   - FileTimeToULL(s_prevUser);
            // kernelDelta includes idle; total elapsed = kernelDelta + userDelta
            // active = total - idle
            unsigned long long totalDelta  = kernelDelta + userDelta;
            if (totalDelta > 0) {
                cpu = 100.0 * (1.0 - static_cast<double>(idleDelta) / static_cast<double>(totalDelta));
                if (cpu < 0.0)   cpu = 0.0;
                if (cpu > 100.0) cpu = 100.0;
            }
        }
        s_prevIdle   = idle;
        s_prevKernel = kernel;
        s_prevUser   = user;
        s_cpuInitialized = true;
    }

    // Memory
    MEMORYSTATUSEX mem;
    mem.dwLength = sizeof(mem);
    if (GlobalMemoryStatusEx(&mem)) {
        memTotalGB = static_cast<double>(mem.ullTotalPhys) / (1024.0 * 1024.0 * 1024.0);
        memUsedGB  = static_cast<double>(mem.ullTotalPhys - mem.ullAvailPhys) / (1024.0 * 1024.0 * 1024.0);
    }

    // Uptime
    ULONGLONG uptimeMs = GetTickCount64();
    uptimeHours = static_cast<double>(uptimeMs) / (1000.0 * 60.0 * 60.0);

#else
    // Non-Windows implementation
    // TODO: Implement system processes for Linux and macOS
    // Linux will have to use /proc/stat for CPU, sysinfo() for memory
    // macOS will have to use host_processor_info(), sysctl()
    cpu         = 0.0;
    memUsedGB   = 0.0;
    memTotalGB  = 0.0;
    uptimeHours = static_cast<double>(clock()) / CLOCKS_PER_SEC / 3600.0;
#endif

    // Set the values to return to the JavaScript side
    result.Set("cpu",         Napi::Number::New(env, cpu));
    result.Set("memoryUsed",  Napi::Number::New(env, memUsedGB));
    result.Set("memoryTotal", Napi::Number::New(env, memTotalGB));
    result.Set("uptime",      Napi::Number::New(env, uptimeHours));

    return result;
}

// Addon registration
static Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        "getSystemInfo",
        Napi::Function::New<GetSystemInfo>(env, "getSystemInfo")
    );
    return exports;
}

NODE_API_MODULE(system_info, Init)
