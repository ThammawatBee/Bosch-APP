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
console.log('defaultConfig', defaultConfig)
console.log('theme', theme)

export default theme;