/**
 * Builds a session whose total length matches the selected workout duration
 * EXACTLY (e.g. 10 min = 600 s, 60 min = 3600 s), including any rest that the
 * timer inserts between items. Main moves repeat in rounds when the library
 * is too small to fill a long session.
 */
export interface Timed {
  durationSec: number;
}

const MIN_ITEM_SEC = 15;

const sum = (items: Timed[]) => items.reduce((s, i) => s + i.durationSec, 0);

export function sessionTotalSeconds(items: Timed[], restSec = 0) {
  return sum(items) + Math.max(0, items.length - 1) * restSec;
}

export function fitSessionToDuration<T extends Timed>(
  warmup: T[],
  pool: T[],
  cooldown: T[],
  targetMin: number,
  restSec = 0,
): T[] {
  const target = Math.max(1, Math.round(targetMin)) * 60;
  if (pool.length === 0) return [];
  const warm = [...warmup];
  const cool = [...cooldown];
  // Warm-up + cool-down should take at most ~40% of the session.
  while (sum(warm) + sum(cool) > target * 0.4 && warm.length + cool.length > 0) {
    if (warm.length >= cool.length && warm.length > 0) warm.pop();
    else cool.pop();
  }

  const main: T[] = [];
  let i = 0;
  const total = () => sessionTotalSeconds([...warm, ...main, ...cool], restSec);
  while (total() < target) {
    const base = pool[i % pool.length]!;
    main.push({ ...base });
    i += 1;
  }

  // Trim/stretch the last main move so the total is exact.
  let diff = target - total(); // <= 0
  while (main.length > 1) {
    const last = main[main.length - 1]!;
    if (last.durationSec + diff >= MIN_ITEM_SEC) break;
    // Too short: drop it and give its time back.
    main.pop();
    diff = target - total();
  }
  const last = main[main.length - 1]!;
  last.durationSec = Math.max(1, last.durationSec + diff);
  return [...warm, ...main, ...cool];
}
