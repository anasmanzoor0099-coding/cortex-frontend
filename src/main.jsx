import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx' // Import the box

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap App inside the AuthProvider so all pages can use it */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)