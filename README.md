# Storybook Bit Addon

## What it does
For projects utilizing both Storybook and Bit, this addon brings Bit component data into Storybook. Using this addon will integrate the following information regarding a component, into Storybook:

* Available version tags
* Installation strings
* Source code
* Dependencies

## Limitations
* Change logs for components are not included since they are not available in the response provided by the api (https://node.bit.dev)
* This addon will not render different component versions in Storybook.

## Prerequisits
* @storybook/react project
* Components hosted with Bit (typically a scope on bit.cloud)
* A server to proxy api-calls towards https://node.bit.dev/[org].[scope]

## Server Api requirements
To be able to display data from https://node.bit.dev you need a server to proxy api calls. For this addon the following routes need to be configured:

* https://[your.domain]/component/{component-id}
* https://[your.domain]/tarball/{component-id}/{version}

The addon requires these routes to return data regarding a specific component that you have hosted on bit.cloud.

The component route must return json data modelled the same way as
https://node.bit.dev/[org].[scope].{component-id}

The tarball route must return the Gunzipped contents of a components tarball:
https://node.bit.dev/@bit/[org].[scope].{component-id}/-/@bit-[org].[scope].{component-id}-{version}.tgz

This addon requires the .tgz to be unzipped on the server and the contens to be returned from the tarball route. Here's an example of how that woul look:
https://sjdesignsystembff.azurewebsites.net/tarball/ui.accordion/2.0.1

## How to implement this addon
Register the addon in .storybook/main.js:

```
module.exports = {
  ...
  "addons": [
    ...
    "storybook-addon-bit"
  ],
  ...
}
```

In your .storybook/preview.js, add a parameters variable if one does not exist already and add a bit paremeter to it, to be able to retrieve Bit component data via your server:

```
export const parameters = {
  ...
  bit: {
    apiUrl: "https://path.to.your.server/",
  }
  ...
}
```

Then in your stories add an object named parameters (if one does not exist already) to the storys' metadata object (the storys' default export) then add bit to parameters:

```
export default {
  ...
  parameters: {
    ...
    bit: {
      componentId: 'ui/button',
    },
    ...
  },
  ...
};
```
