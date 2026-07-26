import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { injectCssVariables } from '@seniorease/core'
import './index.css'
import App from './App.tsx'

injectCssVariables();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
