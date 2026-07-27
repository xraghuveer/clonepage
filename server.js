const { createReadStream, stat } = require("node:fs");
const { extname, join, normalize } = require("node:path");
const { createServer } = require("node:http");

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const publicDirectory = join(__dirname, "public");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendFile(pathname, response) {
  const requestedPath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = normalize(join(publicDirectory, requestedPath));

  if (!filePath.startsWith(`${publicDirectory}/`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  stat(filePath, (error, fileStats) => {
    if (error || !fileStats.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  });
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ status: "ok", service: "clonepage" }));
    return;
  }

  sendFile(decodeURIComponent(url.pathname), response);
});

server.listen(port, host, () => {
  console.log(`clonepage development server listening on http://${host}:${port}`);
});
