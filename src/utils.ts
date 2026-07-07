export function formatPlays(plays: number | undefined): string {
  if (plays === undefined) return '0';
  if (plays >= 1000000000) return `${(plays / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return plays.toString();
}
