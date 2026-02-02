# Security Policy

## Current Security Status

This project was created in 2015-2016 using Meteor 1.4.1.1 and contains several security issues that must be addressed before production deployment.

## Critical Vulnerabilities

### 1. `insecure` Package (CRITICAL)

**Risk**: Allows any client to execute arbitrary MongoDB operations (insert, update, remove) without server-side validation.

**Impact**: Complete database compromise. Attackers can:
- Delete all data
- Modify any records
- Insert malicious data

**Remediation**:
```bash
meteor remove insecure
```

Then implement proper Meteor Methods with validation:
```javascript
Meteor.methods({
  'locations.update'(locationId, data) {
    check(locationId, String);
    check(data, Object);

    // Add authorization check
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Locations.update(locationId, { $set: data });
  }
});
```

### 2. `autopublish` Package (HIGH)

**Risk**: Automatically publishes all database collections to all clients without filtering.

**Impact**: Data exposure. All database contents visible to any user.

**Remediation**:
```bash
meteor remove autopublish
```

Then implement proper publications:
```javascript
// server/publications.js
Meteor.publish('locations', function() {
  return Locations.find({}, {
    fields: { name: 1, coordinates: 1, category: 1 }
  });
});

// Exclude sensitive fields
Meteor.publish('publicHours', function() {
  return Hours.find({}, {
    fields: { internalNotes: 0 }
  });
});
```

### 3. jQuery 1.11.9 (HIGH)

**Risk**: Known security vulnerabilities including:
- CVE-2019-11358: Prototype pollution in `jQuery.extend()`
- XSS vulnerabilities in HTML parsing (fixed in 3.5.0)

**Remediation**:
Update `.meteor/packages`:
```
jquery@3.0.0
```

Or install via npm:
```bash
meteor npm install jquery@3.6.0
```

### 4. Hardcoded API Key (HIGH)

**Location**: `server/server.js:83`
```javascript
const apiKey = "hXZwntEpaZmshEJQIfoOujsCsDNBp1Qp8ypjsn3fdKn2fIPouS";
```

**Risk**: API key exposed in source code and version control.

**Remediation**:

1. Create `settings.json`:
```json
{
  "transloc": {
    "apiKey": "YOUR_API_KEY_HERE"
  }
}
```

2. Update `server/server.js`:
```javascript
const apiKey = Meteor.settings.transloc.apiKey;
```

3. Run with settings:
```bash
meteor --settings settings.json
```

4. Add to `.gitignore`:
```
settings.json
```

5. **Rotate the exposed API key immediately**

## Deprecated Packages

These packages are unmaintained and may have undiscovered vulnerabilities:

| Package | Last Update | Risk |
|---------|-------------|------|
| `iron:router` | 2015 | Low - No known CVEs |
| `meteorhacks:async` | 2015 | Low - Deprecated patterns |
| `u2622:persistent-session` | 2016 | Low - Compatibility issues |
| `fastclick` | 2017 | None - Deprecated, remove |
| `matteodem:easy-search` | 2015 | Low - Requires insecure |
| `ground:db` | 2015 | Low - Compatibility issues |
| `mizzao:autocomplete` | 2015 | Low - Requires insecure |
| `dburles:google-maps` | 2015 | Low - Unmaintained |

## Recommended Security Checklist

Before production deployment:

- [ ] Remove `insecure` package
- [ ] Remove `autopublish` package
- [ ] Implement proper publications with field filtering
- [ ] Implement Meteor Methods with validation
- [ ] Move API keys to environment variables
- [ ] Rotate exposed TransLoc API key
- [ ] Upgrade jQuery to 3.6+
- [ ] Add rate limiting to methods
- [ ] Enable HTTPS
- [ ] Set up Content Security Policy headers
- [ ] Review and update all dependencies

## Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. Email the maintainers directly
3. Allow time for a fix before public disclosure

## Resources

- [Meteor Security Guide](https://guide.meteor.com/security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Secure Meteor Checklist](https://www.securemeteor.com/)
