const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const publicDirectory = path.join(__dirname, "public");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (pathname === "/health") {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  const requestedFile = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(publicDirectory, requestedFile);

  if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch (error) {
    response.writeHead(error.code === "ENOENT" ? 404 : 500, {
      "content-type": "text/plain; charset=utf-8",
    });
    response.end(error.code === "ENOENT" ? "Not found" : "Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`Clonepage development server listening on http://${host}:${port}`);
});
