"use client";

import React, { useState, ReactNode, useEffect, useRef } from "react";
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
  horizontalMarginPercent: number = 5,
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

    // Ensure the item width doesn't exceed available space
    const safeItemWidthPercent = Math.min(itemWidthPercent, availableWidth);

    // Calculate the maximum left position to ensure the item stays within viewport
    const maxLeftPosition = 100 - horizontalMarginPercent - safeItemWidthPercent;

    // Generate a random position that doesn't overlap with the previous item
    let leftPercent: number;

    if (prevItemRange === null) {
      // For the first item, place it randomly within the available space
      const maxLeft = availableWidth - safeItemWidthPercent;
      leftPercent = horizontalMarginPercent + (Math.random() * maxLeft);
    } else {
      // For subsequent items, ensure no horizontal overlap with the previous item
      const [prevLeft, prevRight] = prevItemRange;

      // Determine available spaces to the left and right of the previous item
      // Include the horizontal gap in calculations to ensure minimum distance
      const leftSpaceWidth = prevLeft - horizontalMarginPercent - horizontalGapPercent;
      const rightSpaceWidth = maxLeftPosition - prevRight - horizontalGapPercent;

      if (leftSpaceWidth >= safeItemWidthPercent && rightSpaceWidth >= safeItemWidthPercent) {
        // If there's enough space on both sides, randomly choose one side
        if (Math.random() < 0.5) {
          // Place to the left of the previous item (with gap)
          leftPercent = horizontalMarginPercent + (Math.random() * (leftSpaceWidth - safeItemWidthPercent));
        } else {
          // Place to the right of the previous item (with gap)
          leftPercent = prevRight + horizontalGapPercent + (Math.random() * (rightSpaceWidth - safeItemWidthPercent));
        }
      } else if (leftSpaceWidth >= safeItemWidthPercent) {
        // Only enough space on the left (with gap)
        leftPercent = horizontalMarginPercent + (Math.random() * (leftSpaceWidth - safeItemWidthPercent));
      } else if (rightSpaceWidth >= safeItemWidthPercent) {
        // Only enough space on the right (with gap)
        leftPercent = prevRight + horizontalGapPercent + (Math.random() * (rightSpaceWidth - safeItemWidthPercent));
      } else {
        // Not enough space on either side with the required gap
        // Try to find the best position that maximizes the gap
        if (leftSpaceWidth + horizontalGapPercent > rightSpaceWidth + horizontalGapPercent) {
          // More space on the left
          leftPercent = horizontalMarginPercent + (Math.random() * Math.max(0, prevLeft - horizontalMarginPercent - safeItemWidthPercent));
        } else {
          // More space on the right
          leftPercent = prevRight + (Math.random() * Math.max(0, maxLeftPosition - prevRight));
        }
      }
    }

    // Ensure the item stays within viewport boundaries
    leftPercent = Math.max(horizontalMarginPercent, Math.min(leftPercent, maxLeftPosition));

    // Update the previous item's range for the next iteration
    prevItemRange = [leftPercent, leftPercent + safeItemWidthPercent];

    positions.push({
      top,
      left: `${leftPercent}vw`,
      zIndex: 10 - index // Higher items have higher z-index
    });
  });

  return positions;
}

/**
 * Defines the types of post-appearance animations available
 * 
 * - NONE: No animation after appearance
 * - FLOAT_UP: Elements float upward until they leave the viewport
 * - FLOAT_DOWN: Elements float downward until they leave the viewport
 * - FLOAT_LEFT: Elements float to the left until they leave the viewport
 * - FLOAT_RIGHT: Elements float to the right until they leave the viewport
 * - FLOAT_RANDOM: Each element is assigned a random direction to float
 * - EXPAND: Elements gradually increase in size until they reach a threshold
 * - SHRINK: Elements gradually decrease in size until they reach a threshold
 * - PULSE: Elements pulsate in size (uses CSS animation)
 * - ROTATE: Elements rotate (uses CSS animation)
 * - FADE_OUT: Elements gradually fade out until they're invisible
 */
export enum PostAppearanceAnimationType {
  NONE = "none",
  FLOAT_UP = "float-up",
  FLOAT_DOWN = "float-down",
  FLOAT_LEFT = "float-left",
  FLOAT_RIGHT = "float-right",
  FLOAT_RANDOM = "float-random",
  EXPAND = "expand",
  SHRINK = "shrink",
  PULSE = "pulse",
  ROTATE = "rotate",
  FADE_OUT = "fade-out"
}

/**
 * Configuration for post-appearance animations
 */
export interface AnimationConfig {
  /** The type of animation to apply after elements appear */
  type: PostAppearanceAnimationType;
  /** Animation speed in pixels per second (for movement animations) */
  speed?: number;
  /** Delay in milliseconds before animation starts */
  delay?: number;
  /** Optional custom animation parameters */
  params?: Record<string, any>;
}

interface HoverableCreativesTitleProps {
  children: ReactNode;
  count?: number;
  positionCalculator?: (
    items: ContactPictureMetadata[],
    ...args: any[]
  ) => Position[];
  postAppearanceAnimation?: AnimationConfig;
}

/**
 * HoverableCreativesTitle Component
 * 
 * A component that displays a title which, when hovered, shows a collection of creative contact pictures
 * with customizable positioning and animations.
 * 
 * The animation sequence is:
 * 1. On hover, images appear with a fade-in animation at their initial positions
 * 2. After a configurable delay, the post-appearance animation begins (e.g., floating upward)
 * 3. Images continue animating until they leave the viewport or the user stops hovering
 * 
 * @example
 * // Basic usage with default settings
 * <HoverableCreativesTitle>
 *   <h2>Our Creative Team</h2>
 * </HoverableCreativesTitle>
 * 
 * @example
 * // With custom animation
 * <HoverableCreativesTitle
 *   count={8}
 *   positionCalculator={getCircularPositions}
 *   postAppearanceAnimation={{
 *     type: PostAppearanceAnimationType.FLOAT_RANDOM,
 *     speed: 80,
 *     delay: 300
 *   }}
 * >
 *   <h2>Meet Our Designers</h2>
 * </HoverableCreativesTitle>
 */
export function HoverableCreativesTitle({
  children,
  count = 5,
  positionCalculator = stackVertically,
  postAppearanceAnimation = {
    type: PostAppearanceAnimationType.FLOAT_UP,
    speed: 50, // 50px per second
    delay: 500 // Start floating after 500ms
  }
}: HoverableCreativesTitleProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [contactPictures, setContactPictures] = useState<ContactPictureMetadata[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const pictureElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lastUpdateTimeRef = useRef<number>(0);
  const initialPositionsRef = useRef<Position[]>([]);
  // Store the calculated positions to prevent recalculation
  const [positions, setPositions] = useState<Position[]>([]);

  const handleMouseEnter = () => {
    // Generate contact pictures first
    const newContactPictures = getContactPictures(count);

    // Calculate positions once based on these pictures
    const newPositions = positionCalculator(newContactPictures);

    // Store both the pictures and their positions
    setContactPictures(newContactPictures);
    setPositions(newPositions);

    // Reset animation state
    setAnimationStarted(false);
    initialPositionsRef.current = JSON.parse(JSON.stringify(newPositions));

    // Finally, set hovering state to trigger rendering
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Handle post-appearance animation
  useEffect(() => {
    if (!isHovering || postAppearanceAnimation.type === PostAppearanceAnimationType.NONE) {
      return;
    }

    // Start animation after delay
    const animationTimer = setTimeout(() => {
      // Small delay to ensure elements have fully rendered with their initial CSS positions
      // before we capture their positions for animation
      setTimeout(() => {
        setAnimationStarted(true);
        lastUpdateTimeRef.current = performance.now();

        // Convert initial positions to absolute pixel values
        pictureElementsRef.current.forEach((element, index) => {
          if (!element) return;

          // Store the initial computed position in pixels
          const rect = element.getBoundingClientRect();

          // Important: Don't change the position yet, just store the initial rect
          // This prevents the "jump" that was happening
          element.dataset.initialTop = `${rect.top}`;
          element.dataset.initialLeft = `${rect.left}`;

          // For random direction, assign a random direction to each element
          if (postAppearanceAnimation.type === PostAppearanceAnimationType.FLOAT_RANDOM) {
            const directions = [
              PostAppearanceAnimationType.FLOAT_UP,
              PostAppearanceAnimationType.FLOAT_DOWN,
              PostAppearanceAnimationType.FLOAT_LEFT,
              PostAppearanceAnimationType.FLOAT_RIGHT
            ];
            // Store the random direction in the element's dataset
            element.dataset.randomDirection = directions[Math.floor(Math.random() * directions.length)];
          }
        });

        // Start animation loop
        const animate = (timestamp: number) => {
          if (!lastUpdateTimeRef.current) {
            lastUpdateTimeRef.current = timestamp;
          }

          const deltaTime = timestamp - lastUpdateTimeRef.current;
          lastUpdateTimeRef.current = timestamp;

          // Get viewport dimensions
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Apply animation to each picture element
          pictureElementsRef.current.forEach((element, index) => {
            if (!element || element.style.display === 'none') return;

            const speed = postAppearanceAnimation.speed || 50; // Default 50px per second
            const pixelsToMove = (speed * deltaTime) / 1000; // Convert to pixels per millisecond

            // Get current element position and dimensions
            const rect = element.getBoundingClientRect();

            // Apply different animations based on type
            let animationType = postAppearanceAnimation.type;

            // For random direction, use the element's assigned direction
            if (animationType === PostAppearanceAnimationType.FLOAT_RANDOM && element.dataset.randomDirection) {
              animationType = element.dataset.randomDirection as PostAppearanceAnimationType;
            }

            // On the first animation frame, set the position to absolute/fixed
            // This ensures we don't change positioning until animation actually starts
            if (!element.dataset.animationStarted) {
              element.dataset.animationStarted = 'true';

              // Now we can switch to fixed positioning for animation
              element.style.position = 'fixed';
              element.style.top = `${element.dataset.initialTop}px`;
              element.style.left = `${element.dataset.initialLeft}px`;
              element.style.right = '';
              element.style.bottom = '';

              // Initialize scale for scaling animations
              if (animationType === PostAppearanceAnimationType.EXPAND ||
                animationType === PostAppearanceAnimationType.SHRINK) {
                element.dataset.scale = '1';
              }
            }

            switch (animationType) {
              case PostAppearanceAnimationType.FLOAT_UP: {
                // Get current top position
                const currentTop = parseFloat(element.style.top) || 0;
                // Move up by calculated amount
                element.style.top = `${currentTop - pixelsToMove}px`;

                // Check if element has moved out of viewport
                if (rect.bottom < 0) {
                  // Make element invisible to improve performance
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.FLOAT_DOWN: {
                const currentTop = parseFloat(element.style.top) || 0;
                element.style.top = `${currentTop + pixelsToMove}px`;

                // Check if element has moved out of viewport
                if (rect.top > viewportHeight) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.FLOAT_LEFT: {
                const currentLeft = parseFloat(element.style.left) || 0;
                element.style.left = `${currentLeft - pixelsToMove}px`;

                // Check if element has moved out of viewport
                if (rect.right < 0) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.FLOAT_RIGHT: {
                const currentLeft = parseFloat(element.style.left) || 0;
                element.style.left = `${currentLeft + pixelsToMove}px`;

                // Check if element has moved out of viewport
                if (rect.left > viewportWidth) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.EXPAND: {
                // Get current scale
                const currentScale = parseFloat(element.dataset.scale || '1');
                const newScale = currentScale + (pixelsToMove * 0.01); // Adjust scale factor

                // Apply new scale
                element.style.transform = `scale(${newScale})`;
                element.dataset.scale = newScale.toString();

                // Check if element has expanded too much
                if (newScale > 3) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.SHRINK: {
                // Get current scale
                const currentScale = parseFloat(element.dataset.scale || '1');
                const newScale = Math.max(0.01, currentScale - (pixelsToMove * 0.01)); // Adjust scale factor

                // Apply new scale
                element.style.transform = `scale(${newScale})`;
                element.dataset.scale = newScale.toString();

                // Check if element has shrunk too much
                if (newScale < 0.1) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.FADE_OUT: {
                // Get current opacity
                const currentOpacity = parseFloat(element.style.opacity || '1');
                const newOpacity = Math.max(0, currentOpacity - (pixelsToMove * 0.005)); // Adjust opacity factor

                // Apply new opacity
                element.style.opacity = newOpacity.toString();

                // Check if element has faded out
                if (newOpacity <= 0) {
                  element.style.display = 'none';
                }
                break;
              }
              case PostAppearanceAnimationType.PULSE:
              case PostAppearanceAnimationType.ROTATE:
                // These animations are handled via CSS classes
                break;
              default:
                break;
            }
          });

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      }, 50); // Small delay to ensure CSS transitions have completed
    }, postAppearanceAnimation.delay || 500);

    return () => {
      clearTimeout(animationTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isHovering, postAppearanceAnimation]);

  // Reset refs when component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
            // Get position from the pre-calculated positions
            const position = positions[index];

            // Determine animation classes based on animation type
            let animationClasses = "absolute animate-fadeIn";
            if (animationStarted) {
              if (postAppearanceAnimation.type === PostAppearanceAnimationType.PULSE) {
                animationClasses += " animate-pulse";
              } else if (postAppearanceAnimation.type === PostAppearanceAnimationType.ROTATE) {
                animationClasses += " animate-spin";
              }
            }

            return (
              <div
                key={index}
                ref={el => {
                  pictureElementsRef.current[index] = el;
                }}
                className={animationClasses}
                style={{
                  top: position.top,
                  right: position.right,
                  bottom: position.bottom,
                  left: position.left,
                  zIndex: position.zIndex,
                  transition: animationStarted ? 'none' : 'opacity 0.3s ease-out, transform 0.3s ease-out'
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