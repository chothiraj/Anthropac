export function normalizeItem(item) {
  return item.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function parseFreelistText(text) {
  return text
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function analyzeFreelists(responses) {
  const itemStats = new Map();
  const respondentCount = responses.filter((r) => r.items.length > 0).length || 1;

  responses.forEach((response) => {
    const seen = new Set();
    response.items.forEach((item, index) => {
      const normalized = normalizeItem(item);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      const current = itemStats.get(normalized) ?? {
        item: normalized,
        frequency: 0,
        rankSum: 0,
        firstMentions: 0,
      };
      current.frequency += 1;
      current.rankSum += index + 1;
      if (index === 0) current.firstMentions += 1;
      itemStats.set(normalized, current);
    });
  });

  return Array.from(itemStats.values())
    .map((stat) => ({
      ...stat,
      averageRank: stat.rankSum / stat.frequency,
      smithSalience: stat.frequency / respondentCount * (1 / (stat.rankSum / stat.frequency)),
    }))
    .sort((a, b) => b.smithSalience - a.smithSalience || b.frequency - a.frequency || a.item.localeCompare(b.item));
}

export function analyzePileSorts(sorts) {
  const items = Array.from(new Set(sorts.flatMap((sort) => sort.piles.flatMap((pile) => pile.items.map(normalizeItem))))).sort();
  const indexByItem = new Map(items.map((item, index) => [item, index]));
  const matrix = items.map(() => items.map(() => 0));

  sorts.forEach((sort) => {
    sort.piles.forEach((pile) => {
      const pileItems = Array.from(new Set(pile.items.map(normalizeItem).filter(Boolean)));
      pileItems.forEach((itemA) => {
        pileItems.forEach((itemB) => {
          matrix[indexByItem.get(itemA)][indexByItem.get(itemB)] += 1;
        });
      });
    });
  });

  return { items, matrix, sortCount: sorts.length };
}

export function exportProject(project) {
  return JSON.stringify({ ...project, exportedAt: new Date().toISOString() }, null, 2);
}
