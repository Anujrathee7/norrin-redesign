import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

// Marks that JS is alive. Every reveal's hidden state is scoped to this class,
// so a failed bundle degrades to fully visible content rather than a blank page.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
