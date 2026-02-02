/**
 * Unit tests for lib/algorithms.js
 * Tests core geospatial algorithms used in DiscoverDeis navigation.
 */

const {
  pointIncluded,
  distance,
  degreesToRadians,
  bearing
} = require('../../lib/algorithms');

describe('pointIncluded', () => {
  describe('basic polygon containment', () => {
    // Simple square polygon
    const square = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10]
    ];

    test('returns true for point inside square', () => {
      const point = { x: 5, y: 5 };
      expect(pointIncluded(square, point)).toBe(true);
    });

    test('returns false for point outside square', () => {
      const point = { x: 15, y: 5 };
      expect(pointIncluded(square, point)).toBe(false);
    });

    test('returns false for point far outside', () => {
      const point = { x: 100, y: 100 };
      expect(pointIncluded(square, point)).toBe(false);
    });

    test('handles point on edge (implementation specific)', () => {
      const point = { x: 0, y: 5 };
      // Edge cases are implementation-specific, just ensure no error
      const result = pointIncluded(square, point);
      expect(typeof result).toBe('boolean');
    });

    test('handles point on corner (implementation specific)', () => {
      const point = { x: 0, y: 0 };
      const result = pointIncluded(square, point);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('complex polygons', () => {
    // L-shaped polygon
    const lShape = [
      [0, 0],
      [5, 0],
      [5, 5],
      [10, 5],
      [10, 10],
      [0, 10]
    ];

    test('returns true for point in L-shape body', () => {
      const point = { x: 2, y: 8 };
      expect(pointIncluded(lShape, point)).toBe(true);
    });

    test('returns true for point in L-shape arm', () => {
      const point = { x: 7, y: 7 };
      expect(pointIncluded(lShape, point)).toBe(true);
    });

    test('returns false for point in L-shape cutout', () => {
      const point = { x: 7, y: 2 };
      expect(pointIncluded(lShape, point)).toBe(false);
    });
  });

  describe('triangle polygon', () => {
    const triangle = [
      [0, 0],
      [10, 0],
      [5, 10]
    ];

    test('returns true for point inside triangle', () => {
      const point = { x: 5, y: 3 };
      expect(pointIncluded(triangle, point)).toBe(true);
    });

    test('returns false for point outside triangle', () => {
      const point = { x: 1, y: 9 };
      expect(pointIncluded(triangle, point)).toBe(false);
    });
  });

  describe('real-world coordinates (Brandeis campus area)', () => {
    // Approximate polygon for a campus building
    const brandeisBuilding = [
      [-71.2605, 42.3655],
      [-71.2595, 42.3655],
      [-71.2595, 42.3665],
      [-71.2605, 42.3665]
    ];

    test('returns true for point inside building', () => {
      const point = { x: -71.26, y: 42.366 };
      expect(pointIncluded(brandeisBuilding, point)).toBe(true);
    });

    test('returns false for point outside building', () => {
      const point = { x: -71.27, y: 42.37 };
      expect(pointIncluded(brandeisBuilding, point)).toBe(false);
    });
  });

  describe('edge cases and error handling', () => {
    test('returns false for null vertices', () => {
      expect(pointIncluded(null, { x: 5, y: 5 })).toBe(false);
    });

    test('returns false for undefined vertices', () => {
      expect(pointIncluded(undefined, { x: 5, y: 5 })).toBe(false);
    });

    test('returns false for empty vertices array', () => {
      expect(pointIncluded([], { x: 5, y: 5 })).toBe(false);
    });

    test('returns false for vertices with less than 3 points', () => {
      const line = [[0, 0], [10, 10]];
      expect(pointIncluded(line, { x: 5, y: 5 })).toBe(false);
    });

    test('returns false for null point', () => {
      const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
      expect(pointIncluded(square, null)).toBe(false);
    });

    test('returns false for point with missing coordinates', () => {
      const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
      expect(pointIncluded(square, { x: 5 })).toBe(false);
      expect(pointIncluded(square, { y: 5 })).toBe(false);
    });

    test('returns false for point with non-numeric coordinates', () => {
      const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
      expect(pointIncluded(square, { x: 'five', y: 5 })).toBe(false);
    });
  });
});

describe('distance', () => {
  describe('known distances', () => {
    test('returns 0 for same point', () => {
      const point = { x: 42.3656, y: -71.2598 };
      expect(distance(point, point)).toBeCloseTo(0, 5);
    });

    test('calculates distance between two points correctly', () => {
      // Boston to New York (approximately 306 km)
      const boston = { x: 42.3601, y: -71.0589 };
      const newYork = { x: 40.7128, y: -74.006 };
      const result = distance(boston, newYork);

      // Should be approximately 306 km (306,000 meters)
      expect(result).toBeGreaterThan(300000);
      expect(result).toBeLessThan(320000);
    });

    test('calculates short distance on Brandeis campus', () => {
      // Two points on campus (approximately 100-200 meters apart)
      const point1 = { x: 42.3656, y: -71.2598 };
      const point2 = { x: 42.3666, y: -71.2598 };
      const result = distance(point1, point2);

      // About 111 meters per degree of latitude at this location
      expect(result).toBeGreaterThan(100);
      expect(result).toBeLessThan(150);
    });

    test('is symmetric (distance A to B equals B to A)', () => {
      const point1 = { x: 42.3656, y: -71.2598 };
      const point2 = { x: 42.3700, y: -71.2550 };

      const dist1 = distance(point1, point2);
      const dist2 = distance(point2, point1);

      expect(dist1).toBeCloseTo(dist2, 5);
    });
  });

  describe('edge cases and error handling', () => {
    test('returns NaN for null start point', () => {
      expect(distance(null, { x: 42, y: -71 })).toBeNaN();
    });

    test('returns NaN for null end point', () => {
      expect(distance({ x: 42, y: -71 }, null)).toBeNaN();
    });

    test('returns NaN for undefined points', () => {
      expect(distance(undefined, { x: 42, y: -71 })).toBeNaN();
      expect(distance({ x: 42, y: -71 }, undefined)).toBeNaN();
    });

    test('returns NaN for missing coordinates', () => {
      expect(distance({ x: 42 }, { x: 43, y: -71 })).toBeNaN();
      expect(distance({ x: 42, y: -71 }, { y: -71 })).toBeNaN();
    });

    test('returns NaN for non-numeric coordinates', () => {
      expect(distance({ x: 'forty', y: -71 }, { x: 43, y: -71 })).toBeNaN();
    });
  });

  describe('special geographic cases', () => {
    test('handles points on equator', () => {
      const point1 = { x: 0, y: 0 };
      const point2 = { x: 0, y: 1 };
      const result = distance(point1, point2);

      // 1 degree of longitude at equator ≈ 111.32 km
      expect(result).toBeGreaterThan(110000);
      expect(result).toBeLessThan(112000);
    });

    test('handles points on same meridian', () => {
      const point1 = { x: 0, y: 0 };
      const point2 = { x: 1, y: 0 };
      const result = distance(point1, point2);

      // 1 degree of latitude ≈ 111 km
      expect(result).toBeGreaterThan(110000);
      expect(result).toBeLessThan(112000);
    });

    test('handles negative coordinates', () => {
      const point1 = { x: -33.8688, y: 151.2093 }; // Sydney
      const point2 = { x: -37.8136, y: 144.9631 }; // Melbourne
      const result = distance(point1, point2);

      // Approximately 714 km
      expect(result).toBeGreaterThan(700000);
      expect(result).toBeLessThan(730000);
    });
  });
});

describe('degreesToRadians', () => {
  test('converts 0 degrees to 0 radians', () => {
    expect(degreesToRadians(0)).toBe(0);
  });

  test('converts 90 degrees to π/2 radians', () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
  });

  test('converts 180 degrees to π radians', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
  });

  test('converts 360 degrees to 2π radians', () => {
    expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
  });

  test('converts negative degrees', () => {
    expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
  });

  test('converts decimal degrees', () => {
    expect(degreesToRadians(45.5)).toBeCloseTo((45.5 * Math.PI) / 180, 10);
  });
});

describe('bearing', () => {
  describe('cardinal directions', () => {
    const origin = { x: 42.3656, y: -71.2598 };

    test('returns ~0 degrees for point due north', () => {
      const north = { x: 42.3756, y: -71.2598 };
      const result = bearing(origin, north);
      expect(result).toBeCloseTo(0, 0);
    });

    test('returns ~90 degrees for point due east', () => {
      const east = { x: 42.3656, y: -71.2498 };
      const result = bearing(origin, east);
      expect(result).toBeGreaterThan(85);
      expect(result).toBeLessThan(95);
    });

    test('returns ~180 degrees for point due south', () => {
      const south = { x: 42.3556, y: -71.2598 };
      const result = bearing(origin, south);
      expect(result).toBeGreaterThan(175);
      expect(result).toBeLessThan(185);
    });

    test('returns ~270 degrees for point due west', () => {
      const west = { x: 42.3656, y: -71.2698 };
      const result = bearing(origin, west);
      expect(result).toBeGreaterThan(265);
      expect(result).toBeLessThan(275);
    });
  });

  describe('edge cases', () => {
    test('returns NaN for null start point', () => {
      expect(bearing(null, { x: 42, y: -71 })).toBeNaN();
    });

    test('returns NaN for null end point', () => {
      expect(bearing({ x: 42, y: -71 }, null)).toBeNaN();
    });

    test('returns a valid bearing for same point (undefined direction)', () => {
      const point = { x: 42.3656, y: -71.2598 };
      const result = bearing(point, point);
      // Result is technically 0 but could be NaN depending on implementation
      expect(typeof result).toBe('number');
    });
  });
});

describe('integration tests', () => {
  test('can determine if user is inside a building and calculate distance to exit', () => {
    // Simulate a building polygon
    const building = [
      [-71.2605, 42.3655],
      [-71.2595, 42.3655],
      [-71.2595, 42.3665],
      [-71.2605, 42.3665]
    ];

    // User location inside
    const userLocation = { x: -71.26, y: 42.366 };

    // Exit location
    const exitLocation = { x: -71.2595, y: 42.366 };

    // Check if user is inside
    expect(pointIncluded(building, userLocation)).toBe(true);

    // Calculate distance to exit (note: using y as lat, x as lon for distance)
    const distToExit = distance(
      { x: userLocation.y, y: userLocation.x },
      { x: exitLocation.y, y: exitLocation.x }
    );

    // Should be a reasonable distance (a few tens of meters)
    expect(distToExit).toBeGreaterThan(0);
    expect(distToExit).toBeLessThan(100);
  });
});
