

import { ParseServer } from "parse-server";
import dotenv from "dotenv";
import http from 'http';
import path from "path";
import { fileURLToPath, pathToFileURL } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 1337;

// Correct cloud path for Windows
const cloudPath = pathToFileURL(path.join(__dirname, "cloud", "main.js")).href;

const parseServer = new ParseServer({
  databaseURI: "mongodb://localhost:27017/parse-server-app",
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: `http://localhost:${PORT}/parse`,
  cloud: () => import('./cloud/main.js') || cloudPath,
  fileUpload: {
    allowedFileUrlDomains: [],
  },
  pages: {
    encodePageParamHeaders: true,
  }
});

// Start Parse server *once*
// await parseServer.start();

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/parse")) {
    parseServer.app(req, res);
  } else {
    res.writeHead(200);
    res.end("Parse Server Running");
  }
});

server.listen(PORT, () => {
  console.log(`Parse server is running at http://localhost:${PORT}/parse`);
});