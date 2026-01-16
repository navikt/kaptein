import { useMemo } from 'react';
import { useYtelserFilter, useYtelsesgrupperFilter } from '@/lib/query-state/query-state';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';
import {
  getYtelserForGroup,
  getYtelsesgruppeForYtelse,
  getYtelsesgruppeName,
  isYtelsesgruppe,
  Ytelsesgruppe,
} from '@/lib/types/ytelsesgrupper';

/**
 * Get the list of ytelseIds for an entry (ytelse or ytelsesgruppe)
 */
export const getYtelseIdsForEntry = (entry: YtelseOrGruppeEntry): string[] => {
  if (entry.isGroup) {
    return getYtelserForGroup(entry.id);
  }
  return [entry.id];
};

interface BaseEntry {
  /** Display name */
  navn: string;
  /** The count of behandlinger for this entry */
  behandlingCount: number;
}

interface YtelseEntry extends BaseEntry {
  id: string;
  isGroup: false;
  /** The ID of the parent group, if this ytelse belongs to a group. */
  parentGroupId: Ytelsesgruppe | null;
}

interface GruppeEntry extends BaseEntry {
  id: Ytelsesgruppe;
  isGroup: true;
}

type YtelseOrGruppeEntry = YtelseEntry | GruppeEntry;

/**
 * Get the "group ID" for sorting - either the group's ID or the parent group's ID
 */
const getGroupId = (entry: YtelseOrGruppeEntry): Ytelsesgruppe | null => {
  if (entry.isGroup) {
    return entry.id;
  }
  return entry.parentGroupId;
};

/**
 * Compare two entries for sorting
 */
const compareEntries = (a: YtelseOrGruppeEntry, b: YtelseOrGruppeEntry): number => {
  const aGroupId = getGroupId(a);
  const bGroupId = getGroupId(b);

  // If both belong to the same group
  if (aGroupId !== null && bGroupId !== null && aGroupId === bGroupId) {
    // Group comes before its members
    if (a.isGroup && !b.isGroup) {
      return -1;
    }
    if (!a.isGroup && b.isGroup) {
      return 1;
    }
    // Both are ytelser in the same group - sort by name
    return a.navn.localeCompare(b.navn);
  }

  // If one has a group and the other doesn't, or different groups
  // Sort by group name first, then by entry name
  const aGroupName = aGroupId !== null ? getYtelsesgruppeName(aGroupId) : null;
  const bGroupName = bGroupId !== null ? getYtelsesgruppeName(bGroupId) : null;
  const aSort = aGroupName ?? a.navn;
  const bSort = bGroupName ?? b.navn;

  if (aSort !== bSort) {
    return aSort.localeCompare(bSort);
  }

  // Same sort key - put group first, then by name
  if (a.isGroup && !b.isGroup) {
    return -1;
  }
  if (!a.isGroup && b.isGroup) {
    return 1;
  }
  return a.navn.localeCompare(b.navn);
};

/**
 * Build a map counting behandlinger per ytelseId
 */
const buildYtelseCountMap = <T extends Pick<BaseBehandling, 'ytelseId'>>(behandlinger: T[]): Map<string, number> => {
  const ytelseCountMap = new Map<string, number>();
  for (const b of behandlinger) {
    const count = ytelseCountMap.get(b.ytelseId) ?? 0;
    ytelseCountMap.set(b.ytelseId, count + 1);
  }
  return ytelseCountMap;
};

/**
 * Build group entries and track which ytelser are aggregated
 */
const buildGroupEntries = (
  groupsToShow: Ytelsesgruppe[],
  presentYtelseIds: Set<string>,
  ytelseCountMap: Map<string, number>,
  nothingSelected: boolean,
): { groupEntries: YtelseOrGruppeEntry[]; aggregatedYtelseIds: Set<string> } => {
  const groupEntries: YtelseOrGruppeEntry[] = [];
  const aggregatedYtelseIds = new Set<string>();

  for (const groupId of groupsToShow) {
    // Count total behandlinger for this group
    let groupCount = 0;
    const memberYtelseIds = getYtelserForGroup(groupId);

    for (const ytelseId of memberYtelseIds) {
      if (presentYtelseIds.has(ytelseId)) {
        groupCount += ytelseCountMap.get(ytelseId) ?? 0;
        // Mark this ytelse as aggregated (won't be shown separately unless explicitly selected)
        // Only mark as aggregated if we're NOT in "nothing selected" mode
        // In "nothing selected" mode, we show both groups AND individual ytelser
        if (!nothingSelected) {
          aggregatedYtelseIds.add(ytelseId);
        }
      }
    }

    // Only add the group if it has behandlinger
    if (groupCount > 0) {
      groupEntries.push({
        id: groupId,
        navn: getYtelsesgruppeName(groupId),
        isGroup: true,
        behandlingCount: groupCount,
      });
    }
  }

  return { groupEntries, aggregatedYtelseIds };
};

/**
 * Build individual ytelse entries
 */
const buildYtelseEntries = (
  presentYtelseIds: Set<string>,
  ytelseNameMap: Map<string, string>,
  ytelseCountMap: Map<string, number>,
  selectedYtelser: string[],
  selectedYtelsesgrupper: string[],
  aggregatedYtelseIds: Set<string>,
  nothingSelected: boolean,
): YtelseOrGruppeEntry[] => {
  const ytelseEntries: YtelseOrGruppeEntry[] = [];

  for (const ytelseId of presentYtelseIds) {
    const ytelseName = ytelseNameMap.get(ytelseId) ?? ytelseId;
    const parentGroupId = getYtelsesgruppeForYtelse(ytelseId);
    const isExplicitlySelected = selectedYtelser.includes(ytelseId);
    const isAggregated = aggregatedYtelseIds.has(ytelseId);

    // Show if nothing is selected, or if explicitly selected
    // Don't show if aggregated into a group (unless explicitly selected)
    const shouldShow =
      nothingSelected || isExplicitlySelected || (!isAggregated && selectedYtelsesgrupper.length === 0);

    if (shouldShow) {
      ytelseEntries.push({
        id: ytelseId,
        navn: ytelseName,
        isGroup: false,
        parentGroupId: parentGroupId,
        behandlingCount: ytelseCountMap.get(ytelseId) ?? 0,
      });
    }
  }

  return ytelseEntries;
};

/**
 * Creates a sorted list of ytelser and ytelsesgrupper for chart display.
 * - Selected ytelsesgrupper appear as single aggregated entries
 * - Ytelsesgrupper are positioned above their member ytelser
 * - Alphabetical sorting is preserved otherwise
 * - When nothing is selected, both all ytelsesgrupper AND all ytelser are shown
 */
export const useYtelseChartData = <T extends Pick<BaseBehandling, 'ytelseId'>>(
  behandlinger: T[],
  ytelser: IKodeverkSimpleValue[],
) => {
  const [selectedYtelsesgrupper] = useYtelsesgrupperFilter();
  const [selectedYtelser] = useYtelserFilter();

  return useMemo(() => {
    // Build a map of ytelseId -> ytelse name for quick lookup
    const ytelseNameMap = new Map(ytelser.map((y) => [y.id, y.navn]));

    // Count behandlinger per ytelseId
    const ytelseCountMap = buildYtelseCountMap(behandlinger);

    // Get unique ytelseIds present in the data
    const presentYtelseIds = new Set(behandlinger.map((b) => b.ytelseId));

    const nothingSelected = selectedYtelser.length === 0 && selectedYtelsesgrupper.length === 0;

    // Determine which ytelsesgrupper to show
    const groupsToShow: Ytelsesgruppe[] = nothingSelected
      ? Object.values(Ytelsesgruppe)
      : selectedYtelsesgrupper.filter(isYtelsesgruppe);

    // Build ytelsesgruppe entries
    const { groupEntries, aggregatedYtelseIds } = buildGroupEntries(
      groupsToShow,
      presentYtelseIds,
      ytelseCountMap,
      nothingSelected,
    );

    // Build individual ytelse entries
    const ytelseEntries = buildYtelseEntries(
      presentYtelseIds,
      ytelseNameMap,
      ytelseCountMap,
      selectedYtelser,
      selectedYtelsesgrupper,
      aggregatedYtelseIds,
      nothingSelected,
    );

    // Combine and sort entries
    const entries = [...groupEntries, ...ytelseEntries];
    const sortedEntries = entries.toSorted(compareEntries);

    // Reverse for bar chart display (so highest items appear at top)
    return sortedEntries.reverse();
  }, [behandlinger, ytelser, selectedYtelsesgrupper, selectedYtelser]);
};
