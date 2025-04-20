// Utility for generating consistent random positions per event ID
type LaneVertical = 'start' | 'center' | 'end';
export interface LanePosition {
  vertical: LaneVertical;
  horizontal: number;
}

const positionMap = new Map<string, LanePosition>();
const verticalOptions: LaneVertical[] = ['start', 'center', 'end'];

// Track which lanes (columns) have been assigned to ensure even distribution
const laneAssignments = new Map<number, string[]>();

/**
 * Distributes events evenly across 5 columns, with random vertical positioning
 * @param eventId Unique identifier for the event
 * @param eventIndex Index of the event in the array (used for lane assignment)
 * @param totalEvents Total number of events to distribute
 */
export function getRandomLanePosition(eventId: string, eventIndex: number, totalEvents: number): LanePosition {
  // Return memoized position if exists
  if (positionMap.has(eventId)) {
    return positionMap.get(eventId)!;
  }

  // Determine which lane (column) this event should go in
  // We want to distribute events evenly across the 5 lanes
  const laneCount = 5;
  const lane = (eventIndex % laneCount) + 1;
  
  // Simple hash based on eventId for vertical position
  let hash = 0;
  for (let i = 0; i < eventId.length; i++) {
    hash = (hash * 31 + eventId.charCodeAt(i)) >>> 0;
  }
  
  const vertical = verticalOptions[hash % verticalOptions.length];

  // Track this assignment
  if (!laneAssignments.has(lane)) {
    laneAssignments.set(lane, []);
  }
  laneAssignments.get(lane)!.push(eventId);

  const pos: LanePosition = { vertical, horizontal: lane };
  positionMap.set(eventId, pos);
  return pos;
}
