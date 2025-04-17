# @ckjs/next

Next.js client for ContentKit.

## Installation

```bash
# Using npm
npm install contentkit

# Using yarn
yarn add contentkit

# Using pnpm
pnpm add contentkit

# Using bun
bun add contentkit
```

## Usage

Wrap your Next.js configuration with `withContentkit`:

```javascript
// next.config.js
const { withContentkit } = require("contentkit/next");

module.exports = withContentkit({
  reactStrictMode: true,
});
```

This will automatically rebuild ContentKit content whenever content files are updated.
