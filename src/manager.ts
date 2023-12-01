import { addons, types } from "@storybook/manager-api";
import { TAB_ID } from "./constants";
import { Tab } from "./Tab";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

  // Register the tab
  addons.add(TAB_ID, {
    type: types.TAB,
    title: "Bit versions",
    //👇 Checks the current route for the story
    route: ({ storyId }) => `/bitaddon/${storyId}`,
    //👇 Shows the Tab UI element in myaddon view mode
    match: ({ viewMode }) => viewMode === "bitaddon",
    render: Tab,
  });
