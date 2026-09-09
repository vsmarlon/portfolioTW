import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import { installLinkGuard } from './utils/linkGuard'
import { bootstrapTheme } from './contexts/ThemeContext'
import { applyPerformanceMode, detectPerformanceMode } from './utils/performanceMode'
import './index.css'

installLinkGuard()
bootstrapTheme()
applyPerformanceMode(detectPerformanceMode())

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
