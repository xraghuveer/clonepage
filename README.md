# clonepage

A minimal, dependency-free Node.js development environment for the project.

## Development

Start the application with Docker Compose:

```sh
docker compose -f docker-compose.alloy.yaml up -d
```

The site runs at `http://localhost:3000`, and its health endpoint is available at `http://localhost:3000/health`. Source files are mounted into the container, and Node's watch mode restarts the server after changes.
