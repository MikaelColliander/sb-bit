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
      apiUrl: "https://dev-api.adp.sj.se/public/design-system-server-function/v1/bit/component/",
    }
  },
};

export default preview;
