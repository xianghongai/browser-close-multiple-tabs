import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/auto-icons'],
  manifest: {
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'en',
    permissions: ['contextMenus'],
    // Command IDs keep their original left/right names so existing custom
    // shortcuts survive upgrades; only the user-facing wording is above/below.
    commands: {
      'close-left-tabs': {
        suggested_key: {
          default: 'Alt+Shift+L',
        },
        description: '__MSG_closeTabsAbove__',
      },
      'close-right-tabs': {
        suggested_key: {
          default: 'Alt+Shift+R',
        },
        description: '__MSG_closeTabsBelow__',
      },
      'close-other-tabs': {
        suggested_key: {
          default: 'Alt+Shift+O',
        },
        description: '__MSG_closeOtherTabs__',
      },
    },
  },
});
