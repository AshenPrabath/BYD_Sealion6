import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppLite from './AppLite.jsx'

// Check if we are in "lite" mode via Vite's import.meta.env
const isLite = import.meta.env.MODE === 'lite'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isLite ? <AppLite /> : <App />}
  </StrictMode>,
)
