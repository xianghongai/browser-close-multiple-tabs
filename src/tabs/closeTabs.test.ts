import { describe, expect, it } from 'vitest';

import { getTabsToClose } from './closeTabs';

describe('getTabsToClose', () => {
  const candidateTabs = [
    { id: 10, index: 0 },
    { id: 11, index: 1 },
    { id: 12, index: 2 },
    { id: 13, index: 3 },
  ];

  it('returns only tab ids to the right of the current tab', () => {
    expect(getTabsToClose('close-right-tabs', 1, candidateTabs)).toEqual([12, 13]);
  });

  it('returns only tab ids to the left of the current tab', () => {
    expect(getTabsToClose('close-left-tabs', 2, candidateTabs)).toEqual([10, 11]);
  });

  it('returns every candidate tab id for close-other-tabs', () => {
    expect(getTabsToClose('close-other-tabs', 1, candidateTabs)).toEqual([10, 11, 12, 13]);
  });

  it('returns an empty array for unknown commands', () => {
    expect(getTabsToClose('close-current-tab', 1, candidateTabs)).toEqual([]);
  });

  it('returns an empty array when no tabs match the requested side', () => {
    expect(getTabsToClose('close-right-tabs', 3, candidateTabs)).toEqual([]);
    expect(getTabsToClose('close-left-tabs', 0, candidateTabs)).toEqual([]);
  });

  it('skips candidate tabs without numeric ids', () => {
    expect(getTabsToClose('close-other-tabs', 1, [
      { id: 21, index: 0 },
      { index: 1 },
      { id: 22, index: 2 },
    ])).toEqual([21, 22]);
  });
});
