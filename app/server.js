const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const { Client } = require("pg"); // Przykład z PostgreSQL

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

pgClient.connect();

pgClient.on("notification", (msg) => {
  const payload = JSON.parse(msg.payload);
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
});

pgClient.query("LISTEN new_record");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
