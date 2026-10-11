import { browser, type Browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import {
  CLOSE_LEFT_TABS_COMMAND,
  CLOSE_OTHER_TABS_COMMAND,
  CLOSE_RIGHT_TABS_COMMAND,
  getTabsToClose,
} from '../tabs/closeTabs';

const CLOSE_TABS_MENU_ID = 'close-tabs';

// Menu item IDs reuse the command names so both entry points share one handler.
const CLOSE_TABS_MENU_ITEMS = [
  { id: CLOSE_LEFT_TABS_COMMAND, messageName: 'closeTabsAbove' },
  { id: CLOSE_RIGHT_TABS_COMMAND, messageName: 'closeTabsBelow' },
  { id: CLOSE_OTHER_TABS_COMMAND, messageName: 'closeOtherTabs' },
] as const;

async function getCurrentTab() {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}

async function getCandidateTabs(windowId: number) {
  return browser.tabs.query({
    active: false,
    pinned: false,
    windowId,
  });
}

async function closeTabsAround(command: string, currentTab: Browser.tabs.Tab | undefined) {
  if (currentTab?.windowId == null) {
    return;
  }

  // Keep the current tab and pinned tabs open for every close command.
  const candidateTabs = await getCandidateTabs(currentTab.windowId);
  const tabIds = getTabsToClose(command, currentTab.index, candidateTabs);

  if (tabIds.length > 0) {
    await browser.tabs.remove(tabIds);
  }
}

/**
 * Chrome and Edge do not let extensions extend the tab strip menu, so the
 * entry lives in the page context menu as "Close Tabs > {three actions}".
 * A single top-level item keeps the browser from nesting it under the
 * extension name.
 */
async function createContextMenus() {
  await browser.contextMenus.removeAll();

  browser.contextMenus.create({
    id: CLOSE_TABS_MENU_ID,
    title: browser.i18n.getMessage('closeTabs'),
    contexts: ['page'],
  });

  for (const item of CLOSE_TABS_MENU_ITEMS) {
    browser.contextMenus.create({
      id: item.id,
      title: browser.i18n.getMessage(item.messageName),
      parentId: CLOSE_TABS_MENU_ID,
      contexts: ['page'],
    });
  }
}

/**
 * Registers keyboard shortcuts and page context menu items that close
 * non-pinned tabs around the active tab. Browser API access stays in this
 * entrypoint; tab selection stays testable in the pure closeTabs helper.
 */
export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    void createContextMenus();
  });

  browser.commands.onCommand.addListener(async (command) => {
    await closeTabsAround(command, await getCurrentTab());
  });

  // The page context menu always belongs to the active tab of its window.
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    await closeTabsAround(String(info.menuItemId), tab);
  });
});
