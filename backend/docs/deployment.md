# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 22+
- npm

## Production Deployment

### 1. Environment Setup

```bash
cp .env.example .env
# Edit .env with production values
```

### 2. Using Docker Compose

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Manual Deployment

```bash
npm ci --omit=dev
npm run build
npm start
```

## Environment Variables

Key production variables:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `production` |
| `PORT` | Server port (default: 8000) |
| `MONGODB_URL` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | JWT signing secret (strong, unique) |
| `REFRESH_TOKEN_SECRET` | Refresh token secret (strong, unique) |

## Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Expected response: `{"success":true,"data":{"status":"ok","database":"connected",...}}`

## Monitoring

- **Logs**: Application logs via Pino (JSON format, stdout)
- **Health**: `/api/v1/health` endpoint
