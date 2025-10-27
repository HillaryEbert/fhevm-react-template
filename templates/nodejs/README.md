# Node.js FHEVM Template

Backend server template with FHEVM SDK integration.

## Features

- ✅ Express server
- ✅ TypeScript
- ✅ FHEVM SDK integration
- ✅ REST API endpoints
- ✅ CORS configured
- ✅ Error handling
- ✅ Request validation

## Quick Start

```bash
# Copy this template
cp -r templates/nodejs my-server
cd my-server

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on http://localhost:3000

## Project Structure

```
nodejs/
├── src/
│   ├── index.ts                # Entry point
│   ├── routes/
│   │   ├── encrypt.ts          # Encryption routes
│   │   └── decrypt.ts          # Decryption routes
│   ├── services/
│   │   └── fhevm.ts            # FHEVM service
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validate.ts         # Request validation
│   └── config/
│       └── constants.ts        # Configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Configuration

### 1. Environment Variables

Create `.env`:

```env
PORT=3000
CHAIN_ID=11155111
NETWORK=sepolia
GATEWAY_URL=https://gateway.fhevm.io
```

### 2. Update Constants

Edit `src/config/constants.ts`:

```typescript
export const FHEVM_CONFIG = {
  chainId: Number(process.env.CHAIN_ID),
  network: process.env.NETWORK || 'sepolia',
};
```

## API Endpoints

### POST /api/encrypt

Encrypt a value:

```bash
curl -X POST http://localhost:3000/api/encrypt \
  -H "Content-Type: application/json" \
  -d '{"value": "12345", "type": "uint64"}'
```

Response:
```json
{
  "success": true,
  "encrypted": [/* Uint8Array */],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/decrypt

Request decryption:

```bash
curl -X POST http://localhost:3000/api/decrypt \
  -H "Content-Type: application/json" \
  -d '{"encryptedData": "...", "signature": "..."}'
```

### GET /api/health

Health check:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "fhevm": "initialized",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Services

### FHEVMService

Main FHEVM service:

```typescript
// src/services/fhevm.ts
import { createFhevmInstance } from '@fhevm/sdk';

export class FHEVMService {
  private instance: any;

  async init() {
    this.instance = await createFhevmInstance({
      chainId: 11155111,
      network: 'sepolia',
    });
  }

  async encrypt64(value: bigint) {
    return this.instance.encrypt64(value);
  }
}

export const fhevmService = new FHEVMService();
```

## Middleware

### Error Handler

```typescript
// src/middleware/errorHandler.ts
export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message,
  });
}
```

### Request Validation

```typescript
// src/middleware/validate.ts
export function validateEncryptRequest(req, res, next) {
  const { value, type } = req.body;

  if (!value || !type) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }

  next();
}
```

## Development

### Start Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start Production

```bash
npm start
```

## Testing

### Manual Testing

```bash
# Test encryption
curl -X POST http://localhost:3000/api/encrypt \
  -H "Content-Type: application/json" \
  -d '{"value": "12345", "type": "uint64"}'
```

### Automated Tests

```bash
npm test
```

## Deployment

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t fhevm-server .
docker run -p 3000:3000 fhevm-server
```

### Cloud Deployment

**Heroku:**
```bash
heroku create
git push heroku main
```

**AWS:**
- Use Elastic Beanstalk or ECS
- Configure environment variables
- Set up load balancer

**Digital Ocean:**
- Use App Platform
- Configure build and run commands

## Security

### 1. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api/', limiter);
```

### 2. Input Sanitization

```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/encrypt', [
  body('value').isNumeric(),
  body('type').isIn(['uint8', 'uint16', 'uint32', 'uint64']),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

### 3. CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

## Learn More

- [Express Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [FHEVM SDK Documentation](../../docs)

## License

MIT
