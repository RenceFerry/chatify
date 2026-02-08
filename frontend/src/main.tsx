import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import logo from './assets/logo.png'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <title>Chatify</title>
      <meta name='description' content='Connect with your friends and families anywhere they are with Chatify' />
      <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content" />
      <meta property='og:title' content='Chatify' />
      <meta property='og:description' content='Connect with your friends and families anywhere they are with Chatify' />
      <meta property='og:image' content={logo} />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
