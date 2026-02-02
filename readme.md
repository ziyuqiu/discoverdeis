# Discover Deis

Navigation and location finding web application for Brandeis University campus.

[![Meteor](https://img.shields.io/badge/Meteor-1.4-blue.svg)](https://www.meteor.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Warning**: This project uses Meteor 1.4.1.1 (2016) and contains deprecated packages. See [Security & Deprecation Notes](#security--deprecation-notes) before deploying.

## Overview

Discover Deis is a mobile-friendly web application that helps students, visitors, and faculty navigate the Brandeis University campus. Features include:

- **Turn-by-turn Navigation** - Walking directions between campus locations
- **Location Search** - Find buildings, facilities, and points of interest
- **Self-Guided Tours** - Audio-guided campus tours
- **Real-time Shuttle Tracking** - Live campus bus locations via TransLoc API
- **Operating Hours** - Check if buildings/facilities are open
- **Nearby Locations** - Discover what's around you

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Security & Deprecation Notes](#security--deprecation-notes)
- [Team](#team)
- [License](#license)

## Installation

### Prerequisites

- [Meteor](https://www.meteor.com/install) (v1.4+)
- Node.js (v4.x or v6.x)
- npm

### Setup

1. **Install Meteor**
   ```bash
   curl https://install.meteor.com/ | sh
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/ziyuqiu/discoverdeis.git
   cd discoverdeis
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the application**
   ```bash
   meteor
   ```

5. **Access the app**

   Open http://localhost:3000 in your browser.

## Quick Start

```bash
# Clone and run
git clone https://github.com/ziyuqiu/discoverdeis.git
cd discoverdeis
npm install
meteor

# Run tests
npm test
```

## Features

### Navigation System

The app uses Google Maps API with custom routing algorithms optimized for pedestrian navigation on campus.

| Feature | Description |
|---------|-------------|
| Search | Find buildings by name or category |
| Directions | Step-by-step walking directions |
| Current Location | GPS-based location tracking |
| Compass | Directional guidance with bearing |

### Location Services

- **Point-in-Polygon Detection** - Determines which building you're inside
- **Haversine Distance** - Accurate distance calculations
- **Geospatial Queries** - MongoDB 2dsphere indexes for fast lookups

### Shuttle Tracking

Real-time campus shuttle locations and routes powered by TransLoc API.

## Architecture

```
discoverdeis/
├── client/           # Front-end UI (Blaze templates)
│   ├── layout/       # Navigation, header, footer
│   ├── map/          # Map and navigation interface
│   └── *.js          # Page-specific logic
├── server/           # Back-end logic
│   ├── lib/          # Location/path data (GeoJSON)
│   ├── server.js     # API methods and algorithms
│   ├── startup.js    # Database initialization
│   └── publications.js
├── lib/              # Shared code
│   ├── collections.js
│   └── algorithms.js # Core geospatial functions
├── public/           # Static assets
└── tests/            # Unit tests
```

### Key Technologies

- **Meteor** - Full-stack JavaScript framework
- **Blaze** - Reactive templating
- **MongoDB** - Database with geospatial support
- **Google Maps API** - Maps and geometry
- **TransLoc API** - Shuttle tracking
- **Bootstrap** - Responsive UI

### Core Algorithms

Located in `lib/algorithms.js`:

- `pointIncluded(vertices, point)` - Ray casting point-in-polygon test
- `distance(start, end)` - Haversine formula for geographic distance
- `bearing(start, end)` - Calculate compass bearing between points

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Structure

```
tests/
└── unit/
    └── algorithms.test.js   # 45 tests for core algorithms
```

## API Documentation

### Meteor Methods

#### `pointIncluded(vertices, current)`

Determines if a point is inside a polygon.

```javascript
Meteor.call('pointIncluded', polygonVertices, {x: lat, y: lng});
```

#### `distance(start, end)`

Calculates distance between two geographic points in meters.

```javascript
Meteor.call('distance',
  {x: 42.3656, y: -71.2598},
  {x: 42.3700, y: -71.2550}
);
```

#### `searchLocations(current)`

Finds the current location or nearest location.

```javascript
Meteor.call('searchLocations', {x: lat, y: lng});
// Returns: [location, "in" | "near", distance?]
```

### Collections

| Collection | Description |
|------------|-------------|
| `Locations` | Campus buildings with GeoJSON polygons |
| `Intersections` | Navigation waypoints |
| `CornerPoints` | Building entrances |
| `Paths` | Walking routes (polylines) |
| `Hours` | Operating hours |
| `Shuttles` | Bus routes and schedules |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new functionality
4. Ensure tests pass (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Team

### Original Team (2015 JBS)
- Jessica Huynh
- Tianci Zhong
- Ziyu Qiu

### Independent Study Members
- **Jessica Huynh '16**
- **Ziyu Qiu '18**
- **Limin Wang '16**
- **Dewar Tan MA'16**
- **Jane Kwon '18**

### Contributors
- Chi Zhang
- Xi Qian
- Yiran Zheng

### Faculty Advisor
- Prof. Tim Hickey

## Security & Deprecation Notes

> **This project was created in 2015-2016 and contains outdated dependencies.**

### Critical Issues (Must Fix Before Production)

| Issue | Severity | Description |
|-------|----------|-------------|
| `insecure` package | CRITICAL | Allows clients to directly modify database. Remove before production. |
| `autopublish` package | HIGH | Publishes all data to all clients. Remove and implement proper publications. |
| jQuery 1.11.9 | HIGH | Contains known CVEs (CVE-2019-11358, XSS vulnerabilities). Upgrade to 3.6+. |
| Hardcoded API key | HIGH | TransLoc API key in `server/server.js`. Move to environment variables. |

### Deprecated Packages

| Package | Status | Replacement |
|---------|--------|-------------|
| `iron:router` | Unmaintained | Flow Router or React Router |
| `fastclick` | Deprecated | Remove (no longer needed in modern browsers) |
| `meteorhacks:async` | Unmaintained | Native async/await |
| `u2622:persistent-session` | Unmaintained | `cultofcoders:persistent-session` |
| `twbs:bootstrap` | Deprecated | Install via npm |
| `matteodem:easy-search` | Unmaintained | Algolia, Meilisearch, or custom |
| `ground:db` | Unmaintained | Modern offline solutions |
| `mizzao:autocomplete` | Unmaintained | Modern autocomplete libraries |
| `dburles:google-maps` | Unmaintained | Direct Google Maps API |

### Recommended Actions

1. **For Development/Demo**: App works as-is for local testing
2. **For Production**:
   - Remove `insecure` and `autopublish` packages
   - Move API keys to environment variables
   - Upgrade jQuery to 3.6+
   - Consider migrating to modern Meteor (3.x) or alternative framework

See [SECURITY.md](SECURITY.md) for detailed remediation steps.

## Related Projects

The original Discover Deis repository: [jessicahuynh/voicetour](http://github.com/jessicahuynh/voicetour)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Brandeis University
- Prof. Tim Hickey and the JBS Program
- TransLoc for shuttle tracking API
- Google Maps Platform
