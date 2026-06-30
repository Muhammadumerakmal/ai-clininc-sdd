# Environment Configuration Guide

## Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/clinic_mgmt` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | — |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | — |

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `8000` |
| `CORS` | CORS origin | `*` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379` |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | — |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `QDRANT_URL` | Qdrant vector DB URL | `http://localhost:6333` |
| `QDRANT_API_KEY` | Qdrant API key | — |
| `MAILTRAP_SMTP_HOST` | Mailtrap SMTP host | `sandbox.smtp.mailtrap.io` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

## Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Set redirect URI to `http://localhost:8000/api/v1/auth/google/callback`
4. Copy Client ID and Client Secret to `.env`

## OpenAI Setup

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Set `OPENAI_API_KEY` in `.env`
3. The AI module uses `gpt-4o-mini` model
