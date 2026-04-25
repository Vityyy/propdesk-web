export interface Interval {
  start: number;
  end: number;
}

export interface ApartmentRangeData {
  startFloor: number;
  endFloor: number;
  startApartmentNumber: number;
  endApartmentNumber: number;
  squareMeters: number;
  rentValue: number;
}

/**
 * Parses a string like "1-5, 9, 11" into an array of Intervals.
 * Throws an error if format is invalid or if there are internal overlaps.
 */
export function parseRange(input: string): Interval[] {
  if (!input || input.trim() === '') return [];

  const parts = input.split(',').map((p) => p.trim()).filter(Boolean);
  const intervals: Interval[] = [];

  for (const part of parts) {
    if (part.includes('-')) {
      const split = part.split('-');
      if (split.length !== 2) {
        throw new Error(`Invalid range format: '${part}'. Should be like '1-5'`);
      }
      const start = parseInt(split[0].trim(), 10);
      const end = parseInt(split[1].trim(), 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid number in range: '${part}'`);
      }
      if (start > end) {
        throw new Error(`Start must be less than or equal to end: '${part}'`);
      }
      intervals.push({ start, end });
    } else {
      const val = parseInt(part, 10);
      if (isNaN(val)) {
        throw new Error(`Invalid number: '${part}'`);
      }
      intervals.push({ start: val, end: val });
    }
  }

  // Sort and check for internal overlaps
  intervals.sort((a, b) => a.start - b.start);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i].start <= intervals[i - 1].end) {
      throw new Error(`Overlapping ranges detected: '${intervals[i - 1].start}-${intervals[i - 1].end}' and '${intervals[i].start}-${intervals[i].end}'`);
    }
  }

  return intervals;
}

/**
 * Generates Cartesian product of floor Intervals and apartment Intervals.
 */
export function generateApartmentRanges(
  floorIntervals: Interval[],
  aptIntervals: Interval[],
  squareMeters: number,
  rentValue: number
): ApartmentRangeData[] {
  const result: ApartmentRangeData[] = [];
  
  for (const f of floorIntervals) {
    for (const a of aptIntervals) {
      result.push({
        startFloor: f.start,
        endFloor: f.end,
        startApartmentNumber: a.start,
        endApartmentNumber: a.end,
        squareMeters,
        rentValue,
      });
    }
  }
  
  return result;
}

/**
 * Checks if two 1D intervals overlap.
 */
function isIntervalOverlap(a: Interval, b: Interval): boolean {
  return Math.max(a.start, b.start) <= Math.min(a.end, b.end);
}

/**
 * Validates a list of ApartmentRangeData to ensure no two ranges overlap in the 2D grid.
 * Returns null if valid, or a descriptive string error if an overlap is found.
 */
export function findOverlapError(ranges: ApartmentRangeData[]): string | null {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const r1 = ranges[i];
      const r2 = ranges[j];

      const floorOverlap = isIntervalOverlap(
        { start: r1.startFloor, end: r1.endFloor },
        { start: r2.startFloor, end: r2.endFloor }
      );

      const aptOverlap = isIntervalOverlap(
        { start: r1.startApartmentNumber, end: r1.endApartmentNumber },
        { start: r2.startApartmentNumber, end: r2.endApartmentNumber }
      );

      if (floorOverlap && aptOverlap) {
        return `Overlap detected between (Floors ${r1.startFloor}-${r1.endFloor}, Apts ${r1.startApartmentNumber}-${r1.endApartmentNumber}) and (Floors ${r2.startFloor}-${r2.endFloor}, Apts ${r2.startApartmentNumber}-${r2.endApartmentNumber})`;
      }
    }
  }
  return null;
}
