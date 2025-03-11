"use client";

import React, { useState, ReactNode } from "react";
import {
  SkeletonContactPicture,
  getContactPictures,
  ContactPictureMetadata
} from "@/components/contacts/SkeletonContactPicture";

export interface Position {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
}

/**
 * Generates positions for elements to be aligned at the top with equal gaps
 * @param items Array of items with width and height
 * @param gapInPx Gap between items in pixels
 * @param topOffsetInPx Distance from the top in pixels
 * @returns Array of Position objects
 */
export function alignTopWithEqualGap(
  items: Array<{ width: number; height: number }>,
  gapInPx: number = 20,
  topOffsetInPx: number = 20
): Position[] {
  const positions: Position[] = [];
  let currentLeft = 0;

  // Calculate total width needed
  const totalWidth = items.reduce((sum, item) => sum + item.width, 0) +
    gapInPx * (items.length - 1);

  // Start from the left edge (centered)
  let startLeft = -totalWidth / 2;

  items.forEach((item) => {
    positions.push({
      top: `${topOffsetInPx}px`,
      left: `calc(50% + ${startLeft + currentLeft}px)`,
      zIndex: 10
    });

    // Move to the next position
    currentLeft += item.width + gapInPx;
  });

  return positions;
}

/**
 * Generates a cascading layout of positions for items
 * @param items Array of items with width and height
 * @param startTopPx Starting top position in pixels
 * @param startRightPx Starting right position in pixels
 * @param cascadeStepPx Amount of pixels to cascade each item
 * @returns Array of Position objects
 */
export function getCascadingPositions(
  items: Array<{ width: number; height: number }>,
  startTopPx: number = 20,
  startRightPx: number = 20,
  cascadeStepPx: number = 30
): Position[] {
  return items.map((_, index) => {
    // Create a cascading effect where each item is offset from the previous one
    return {
      top: `${startTopPx + (index * cascadeStepPx)}px`,
      right: `${startRightPx + (index * cascadeStepPx / 2)}px`,
      zIndex: 20 - index
    };
  });
}

/**
 * Generates a circular layout of positions around a center point
 * @param items Array of items with width and height
 * @param radiusPx Radius of the circle in pixels
 * @param centerTopOffsetPx Top offset for the center of the circle
 * @param centerRightOffsetPx Right offset for the center of the circle
 * @returns Array of Position objects
 */
export function getCircularPositions(
  items: Array<{ width: number; height: number }>,
  radiusPx: number = 150,
  centerTopOffsetPx: number = 100,
  centerRightOffsetPx: number = 100
): Position[] {
  const positions: Position[] = [];
  const itemCount = items.length;

  items.forEach((item, index) => {
    // Calculate position on a circle
    const angle = (index / itemCount) * 2 * Math.PI;
    const x = Math.cos(angle) * radiusPx;
    const y = Math.sin(angle) * radiusPx;

    positions.push({
      top: `calc(50% + ${centerTopOffsetPx + y - (item.height / 2)}px)`,
      left: `calc(50% + ${x - centerRightOffsetPx - (item.width / 2)}px)`,
      zIndex: 10
    });
  });

  return positions;
}

/**
 * Generates a vertical stack of positions with specified gap and randomized horizontal positions
 * @param items Array of items with width and height
 * @param verticalGapPercent Gap between items as percentage of viewport height (default 2%)
 * @param horizontalGapPercent Minimum horizontal gap between items as percentage of viewport width (default 5%)
 * @param topMarginPercent Top margin as percentage of viewport height (default 2%)
 * @param horizontalMarginPercent Horizontal margin as percentage of viewport width (default 2%)
 * @returns Array of Position objects
 */
export function stackVertically(
  items: Array<{ width: number; height: number }>,
  verticalGapPercent: number = 2,
  horizontalGapPercent: number = 5,
  topMarginPercent: number = 2,
  horizontalMarginPercent: number = 2
): Position[] {
  const positions: Position[] = [];

  // Convert percentage to viewport units
  const verticalGap = `${verticalGapPercent}vh`;
  const topMargin = `${topMarginPercent}vh`;
  const horizontalMargin = `${horizontalMarginPercent}vw`;

  // Track previous item's horizontal position range to avoid overlap
  // We'll use a percentage-based approach (0-100) to represent the viewport width
  let prevItemRange: [number, number] | null = null;

  items.forEach((item, index) => {
    let top: string;

    if (index === 0) {
      // First item positioned at top margin
      top = topMargin;
    } else {
      // For subsequent items, calculate position based on previous items' heights
      // We need to account for all previous items' heights plus gaps
      top = `calc(${topMargin} + ${items.slice(0, index).reduce((sum, prevItem) => sum + prevItem.height, 0)}px + (${index} * ${verticalGap}))`;
    }

    // Calculate available horizontal space (accounting for margins)
    const availableWidth = 100 - (2 * horizontalMarginPercent); // in percentage units

    // Assume a reasonable average viewport width for calculation purposes
    // This is just for determining relative sizes, not absolute positioning
    const assumedViewportWidth = 1200; // pixels
    const itemWidthPercent = (item.width / assumedViewportWidth) * 100;

    // Generate a random position that doesn't overlap with the previous item
    let leftPercent: number;

    if (prevItemRange === null) {
      // For the first item, place it randomly within the available space
      const maxLeft = availableWidth - itemWidthPercent;
      leftPercent = horizontalMarginPercent + (Math.random() * maxLeft);
    } else {
      // For subsequent items, ensure no horizontal overlap with the previous item
      const [prevLeft, prevRight] = prevItemRange;

      // Determine available spaces to the left and right of the previous item
      // Include the horizontal gap in calculations to ensure minimum distance
      const leftSpaceWidth = prevLeft - horizontalMarginPercent - horizontalGapPercent;
      const rightSpaceWidth = (100 - horizontalMarginPercent) - prevRight - horizontalGapPercent;

      if (leftSpaceWidth >= itemWidthPercent && rightSpaceWidth >= itemWidthPercent) {
        // If there's enough space on both sides, randomly choose one side
        if (Math.random() < 0.5) {
          // Place to the left of the previous item (with gap)
          leftPercent = horizontalMarginPercent + (Math.random() * (leftSpaceWidth - itemWidthPercent));
        } else {
          // Place to the right of the previous item (with gap)
          leftPercent = prevRight + horizontalGapPercent + (Math.random() * (rightSpaceWidth - itemWidthPercent));
        }
      } else if (leftSpaceWidth >= itemWidthPercent) {
        // Only enough space on the left (with gap)
        leftPercent = horizontalMarginPercent + (Math.random() * (leftSpaceWidth - itemWidthPercent));
      } else if (rightSpaceWidth >= itemWidthPercent) {
        // Only enough space on the right (with gap)
        leftPercent = prevRight + horizontalGapPercent + (Math.random() * (rightSpaceWidth - itemWidthPercent));
      } else {
        // Not enough space on either side with the required gap
        // Try to find the best position that maximizes the gap
        if (leftSpaceWidth + horizontalGapPercent > rightSpaceWidth + horizontalGapPercent) {
          // More space on the left
          leftPercent = horizontalMarginPercent + (Math.random() * Math.max(0, prevLeft - horizontalMarginPercent - itemWidthPercent));
        } else {
          // More space on the right
          leftPercent = prevRight + (Math.random() * Math.max(0, 100 - horizontalMarginPercent - prevRight - itemWidthPercent));
        }
      }
    }

    // Update the previous item's range for the next iteration
    prevItemRange = [leftPercent, leftPercent + itemWidthPercent];

    positions.push({
      top,
      left: `${leftPercent}vw`,
      zIndex: 10 - index // Higher items have higher z-index
    });
  });

  return positions;
}

interface HoverableCreativesTitleProps {
  children: ReactNode;
  count?: number;
  positionCalculator?: (items: ContactPictureMetadata[], context?: any) => Position[];
}

export function HoverableCreativesTitle({
  children,
  count = 5,
  positionCalculator = stackVertically
}: HoverableCreativesTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [contactPictures, setContactPictures] = useState<ContactPictureMetadata[]>([]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setContactPictures(getContactPictures(count));
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const calculatedPositions = positionCalculator(contactPictures);

  return (
    <div className="relative">
      <div
        className="w-fit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isHovering && (
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          {contactPictures.map((picture, index) => {
            // Get position from the calculated positions
            const position = calculatedPositions[index];

            return (
              <div
                key={index}
                className="absolute animate-fadeIn"
                style={{
                  top: position.top,
                  right: position.right,
                  bottom: position.bottom,
                  left: position.left,
                  zIndex: position.zIndex
                }}
              >
                <SkeletonContactPicture
                  width={picture.width}
                  height={picture.height}
                  url={picture.url}
                  className="shadow-lg"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 