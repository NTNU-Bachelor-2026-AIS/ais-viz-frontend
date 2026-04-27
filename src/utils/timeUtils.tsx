

export type SatellitePoint = {
  longitude: number;
  latitude: number;
  time: string;
};

export const getClosestSatellitePoint = (
  points: SatellitePoint[],
  targetTime: number,
): SatellitePoint | null => {
    if (!points || points.length === 0) return null;

    // Find the start time to then calculate target time
    const startTime = new Date(points[0].time).getTime();

    // Functions use milliseconds
    const interval = 60000;

    // Calculate where in the index it is based on time
    let index = Math.round((targetTime - startTime) / interval);

    // Makes sure the index is within the range.
    index = Math.max(0, Math.min(index, points.length -1));

    return points[index];
};

