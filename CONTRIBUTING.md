# Contributing to Discover Deis

Thank you for your interest in contributing to Discover Deis!

## Development Setup

1. Install [Meteor](https://www.meteor.com/install)
2. Clone the repository
3. Run `npm install` for test dependencies
4. Run `meteor` to start the development server

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Code Style

- Use 2-space indentation
- Use camelCase for variables and functions
- Add JSDoc comments for public functions
- Keep functions focused and small

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `master`
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation as needed
6. Submit a pull request

## Commit Message Format

Use conventional commits:

```
feat: add new feature
fix: fix bug in navigation
docs: update README
test: add unit tests
refactor: improve algorithm performance
```

## Adding Campus Locations

Location data is stored in `server/lib/locations_*.js`. Each location includes:

- `name`: Display name
- `coordinates`: GeoJSON polygon
- `category`: Location type
- `description`: Optional description

## Questions?

Open an issue or contact the maintainers.
