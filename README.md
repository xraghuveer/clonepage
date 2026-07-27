# clonepage

A minimal, dependency-free Node development workspace ready for application work.

## Development

Start the site with Docker Compose:

```bash
docker compose -f docker-compose.alloy.yaml up -d
```

The application listens at [http://localhost:3000](http://localhost:3000). It includes a health endpoint at `/api/health`, and source changes restart the development server automatically.

The Alloy environment proxies this application at [http://localhost:8080](http://localhost:8080).
