import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WheelingCalculator from './WheelingCalculator'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WheelingCalculator />
  </StrictMode>,
)
