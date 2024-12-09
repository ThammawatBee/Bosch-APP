import { createSystem, defaultConfig, defineConfig, defineTextStyles, defineTokens } from "@chakra-ui/react"

const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      // fonts: {
      //   heading: { value: "Sarabun" },
      //   body: { value: "Sarabun" },
      // },
    },
  },
})

export default theme;