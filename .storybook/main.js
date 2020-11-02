module.exports = {
  stories: ["../src/**/*.stories.@(js|mdx|ts|tsx)"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/preset-typescript",
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-viewport/register",
  ],
};
