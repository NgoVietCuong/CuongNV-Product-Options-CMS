import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      "*": {
        userSelect: "none",
      },
    },
  },
});

export default theme;