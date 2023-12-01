import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    bit: {
      apiUrl: "https://sjdesignsystembff.azurewebsites.net/",
    }
  },
};

export default preview;
