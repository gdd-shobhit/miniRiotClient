{
  "targets": [
    {
      "target_name": "system_info",
      "sources": [ "native/system_info.cpp" ],

      "include_dirs": [
        "node_modules/node-addon-api"
      ],

      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],

      "conditions": [
        ["OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 0,
              "RuntimeTypeInfo": "false"
            }
          },
          "libraries": []
        }],
        ["OS=='mac'", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "NO",
            "CLANG_CXX_LANGUAGE_STANDARD": "c++14"
          }
        }],
        ["OS=='linux'", {
          "cflags_cc!": ["-fno-exceptions"]
        }]
      ]
    }
  ]
}
