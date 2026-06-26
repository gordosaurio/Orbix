import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const fontshareHref =
  'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=cabinet-grotesk@500,700,800&display=swap'

if (!document.querySelector(`link[href="${fontshareHref}"]`)) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = fontshareHref
  document.head.appendChild(link)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)