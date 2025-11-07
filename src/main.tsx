/**
 * main.tsx — bootstraps React with Chakra UI theming.
 */
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'
import theme from './theme'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </StrictMode>,
)
