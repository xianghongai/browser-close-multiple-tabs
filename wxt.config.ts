import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: ({ browser }) => ({
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'en',
    permissions: ['tabs'],
    commands: {
      'close-right-tabs': {
        suggested_key: {
          default: 'Alt+Shift+R',
        },
        description: '__MSG_closeTabsToRight__',
      },
      'close-left-tabs': {
        suggested_key: {
          default: 'Alt+Shift+L',
        },
        description: '__MSG_closeTabsToLeft__',
      },
      'close-other-tabs': {
        suggested_key: {
          default: 'Alt+Shift+O',
        },
        description: '__MSG_closeOtherTabs__',
      },
    },
    icons: {
      16: '16.png',
      32: '32.png',
      48: '48.png',
      128: '128.png',
    },
    browser_specific_settings: browser === 'firefox'
      ? {
        gecko: {
          data_collection_permissions: {
            required: ['none'],
          },
        },
      }
      : undefined,
  }),
});
