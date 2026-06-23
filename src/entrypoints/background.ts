import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/utils/define-background';
import { getTabsToClose } from '../tabs/closeTabs';

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

/**
 * Registers keyboard shortcuts that close non-pinned tabs around the active tab.
 * Browser API access stays in this entrypoint; tab selection stays testable in
 * the pure closeTabs helper.
 */
export default defineBackground(() => {
  browser.commands.onCommand.addListener(async (command) => {
    const currentTab = await getCurrentTab();

    if (currentTab?.windowId == null) {
      return;
    }

    // Keep the current tab and pinned tabs open for every close command.
    const candidateTabs = await getCandidateTabs(currentTab.windowId);
    const tabIds = getTabsToClose(command, currentTab.index, candidateTabs);

    if (tabIds.length > 0) {
      await browser.tabs.remove(tabIds);
    }
  });
});
