/**
 * Core algorithms for DiscoverDeis navigation system.
 * These pure functions are used for geospatial calculations.
 */

/**
 * Determines if a point is inside a polygon using ray casting algorithm.
 * Algorithm from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 *
 * @param {Array<Array<number>>} vertices - Array of [x, y] coordinate pairs defining the polygon
 * @param {{x: number, y: number}} current - The point to test
 * @returns {boolean} True if the point is inside the polygon
 */
function pointIncluded(vertices, current) {
  if (!vertices || !Array.isArray(vertices) || vertices.length < 3) {
    return false;
  }
  if (!current || typeof current.x !== 'number' || typeof current.y !== 'number') {
    return false;
  }

  var included = false;
  var numVert = vertices.length;

  // Create arrays of the x and y coordinates of the polygon
  var xArray = [];
  var yArray = [];

  for (var i = 0; i < numVert; i++) {
    xArray.push(vertices[i][0]);
    yArray.push(vertices[i][1]);
  }

  for (var i = 0, j = numVert - 1; i < numVert; j = i++) {
    if (
      yArray[i] >= current.y !== yArray[j] >= current.y &&
      current.x <=
        ((xArray[j] - xArray[i]) * (current.y - yArray[i])) /
          (yArray[j] - yArray[i]) +
          xArray[i]
    ) {
      included = !included;
    }
  }

  return included;
}

/**
 * Calculates the distance between two geographic points using the Haversine formula.
 * Adapted from http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {{x: number, y: number}} start - Starting point (x = latitude, y = longitude)
 * @param {{x: number, y: number}} end - Ending point (x = latitude, y = longitude)
 * @returns {number} Distance in meters
 */
function distance(start, end) {
  if (!start || !end) {
    return NaN;
  }
  if (typeof start.x !== 'number' || typeof start.y !== 'number') {
    return NaN;
  }
  if (typeof end.x !== 'number' || typeof end.y !== 'number') {
    return NaN;
  }

  var R = 6371000; // Earth's radius in metres

  var lat1 = start.x;
  var lat2 = end.x;
  var lon1 = start.y;
  var lon2 = end.y;

  var p1 = lat1 * (Math.PI / 180);
  var p2 = lat2 * (Math.PI / 180);
  var dp = (lat2 - lat1) * (Math.PI / 180);
  var dl = (lon2 - lon1) * (Math.PI / 180);

  var a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;

  return d;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates bearing between two points.
 *
 * @param {{x: number, y: number}} start - Starting point (x = latitude, y = longitude)
 * @param {{x: number, y: number}} end - Ending point (x = latitude, y = longitude)
 * @returns {number} Bearing in degrees (0-360)
 */
function bearing(start, end) {
  if (!start || !end) {
    return NaN;
  }

  var lat1 = degreesToRadians(start.x);
  var lat2 = degreesToRadians(end.x);
  var dLon = degreesToRadians(end.y - start.y);

  var y = Math.sin(dLon) * Math.cos(lat2);
  var x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  var brng = Math.atan2(y, x);
  brng = brng * (180 / Math.PI);
  brng = (brng + 360) % 360;

  return brng;
}

// Export for both Node.js (testing) and Meteor (browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    pointIncluded: pointIncluded,
    distance: distance,
    degreesToRadians: degreesToRadians,
    bearing: bearing
  };
}

// Make available globally for Meteor
if (typeof window !== 'undefined') {
  window.Algorithms = {
    pointIncluded: pointIncluded,
    distance: distance,
    degreesToRadians: degreesToRadians,
    bearing: bearing
  };
}
