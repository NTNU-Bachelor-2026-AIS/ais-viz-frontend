export type SatellitePoint = {
  longitude: number;
  latitude: number;
  time: string;
};

export const getClosestSatellitePoint = (
  points: SatellitePoint[],
  targetTimeStr: string,
): SatellitePoint | null => {
    if (!points || points.length === 0) return null;

    // Find the start time to then calculate target time
    // Seperate date from the time and turn into seconds (Making into seconds was an idea from AI)
    const tragetDate = new Date(targetTimeStr)
    const targetDateIntoSeconds = 
        (tragetDate.getUTCHours() * 3600) +
        (tragetDate.getUTCHours() * 60) +
        tragetDate.getUTCSeconds();

    // Since the data starts and ends at midnight setting the seconds to 0 works.
    const startDateIntoSeconds = 0;
    let diffSeconds = targetDateIntoSeconds - startDateIntoSeconds;

    // Calculate where in the index it is based on time
    let index = Math.round((diffSeconds) / 60);

    // Makes sure the index is within the range.
    index = Math.max(0, Math.min(index, points.length -1));

    return points[index];
};

