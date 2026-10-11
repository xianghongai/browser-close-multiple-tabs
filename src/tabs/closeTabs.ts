export const CLOSE_RIGHT_TABS_COMMAND = 'close-right-tabs';
export const CLOSE_LEFT_TABS_COMMAND = 'close-left-tabs';
export const CLOSE_OTHER_TABS_COMMAND = 'close-other-tabs';

export type CloseTabsCommand =
  | typeof CLOSE_RIGHT_TABS_COMMAND
  | typeof CLOSE_LEFT_TABS_COMMAND
  | typeof CLOSE_OTHER_TABS_COMMAND;

export type CandidateTab = {
  id?: number;
  index: number;
};

function getTabId(tab: CandidateTab) {
  return typeof tab.id === 'number' ? tab.id : null;
}

function getTabIds(tabs: readonly CandidateTab[]) {
  return tabs.map(getTabId).filter((tabId): tabId is number => tabId != null);
}

/**
 * Selects tab IDs for a shortcut command from tabs already scoped by the caller.
 * The background entrypoint passes only non-active, non-pinned tabs, so this
 * helper only decides relative position and filters out tabs without IDs.
 */
export function getTabsToClose(command: string, currentTabIndex: number, tabs: readonly CandidateTab[]): number[] {
  switch (command) {
    case CLOSE_OTHER_TABS_COMMAND:
      return getTabIds(tabs);
    case CLOSE_RIGHT_TABS_COMMAND:
      return getTabIds(tabs.filter((tab) => tab.index > currentTabIndex));
    case CLOSE_LEFT_TABS_COMMAND:
      return getTabIds(tabs.filter((tab) => tab.index < currentTabIndex));
    default:
      return [];
  }
}
