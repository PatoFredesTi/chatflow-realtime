import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/msn-theme.css'  // ← AGREGAR ESTA LÍNEA

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)