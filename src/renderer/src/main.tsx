/**
 * Renderer entry point — React mounts here.
 * This is equivalent to my UMG widget tree root or Slate application entry.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from '@renderer/App'
import '@renderer/styles/global.css'

// HashRouter is preferred in Electron over BrowserRouter because Electron
// loads files directly from disk in production (file:// protocol), which
// doesn't support history-based routing without a server.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
