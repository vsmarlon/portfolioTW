import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app.tsx'
import { installLinkGuard } from './utils/linkGuard'
import './index.css'

installLinkGuard()

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)