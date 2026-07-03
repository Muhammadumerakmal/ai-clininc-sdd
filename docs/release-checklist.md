# Release Checklist

## Pre-Release
- [ ] All environment variables configured
- [ ] Access token secret set to strong, unique value
- [ ] Refresh token secret set to strong, unique value
- [ ] CORS origin restricted to frontend domain
- [ ] Database connection string set to production database
- [ ] Rate limiting configured for production
- [ ] HTTPS enabled behind reverse proxy

## Build
- [ ] `npm run build` succeeds
- [ ] TypeScript compilation produces 0 errors
- [ ] Docker image builds successfully

## Test
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] API contract tests pass
- [ ] Performance tests pass (if applicable)

## Deploy
- [ ] Database migrations run
- [ ] Health check returns `ok`
- [ ] Auth endpoints functional
- [ ] Core CRUD operations functional
- [ ] Logs confirming expected behavior

## Post-Release
- [ ] Monitor error rates
- [ ] Verify rate limiting
- [ ] Check audit logs
