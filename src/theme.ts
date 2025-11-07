/**
 * theme.ts — Chakra theme overrides shared across the SPA.
 */
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        _dark: {
          bg: 'gray.900',
          color: 'gray.100',
        },
      },
    },
  },
  fonts: {
    heading: "'Noto Sans JP', 'Inter', system-ui, sans-serif",
    body: "'Noto Sans JP', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', monospace",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'teal',
      },
    },
  },
})

export default theme
