const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const mysql = require("mysql2");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// let items = [
//   { id: 1, name: "Initial Item 1" },
//   { id: 2, name: "Initial Item 2" },
// ];

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "plus91",
  database: "test123",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
  } else {
    console.log("Connected to MySQL Database ✅");
  }
});

const fetchItems = (ws) => {
  db.query("SELECT * FROM USER", (err, results) => {
    if (err) {
      console.error("Error fetching items:", err);
      return;
    }
    ws.send(JSON.stringify({ type: "read", data: results }));
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected ✅");

  // Send initial data from MySQL
  fetchItems(ws);

  // ws.send(JSON.stringify({ type: "read", data: items }));

  ws.on("message", (message) => {
    try {
      const { type, data } = JSON.parse(message);
      switch (type) {
        case "create":
          db.query(
            "INSERT INTO USER (name) value (?)",
            [data.name],
            (err, result) => {
              if (err) {
                console.log("Error inserting item : ", err);
                return;
              }
              broadcastItems();
            }
          );

          // const newItem = { id: Date.now(), ...data };
          // items.push(newItem);
          break;
        case "update":
          // const items = items.map((item) =>
          //   item.id === data.id ? { ...item, ...data } : item
          // );
          db.query(
            "UPDATE USER SET name=? WHERE id=?",
            [data.name, data.id],
            (err) => {
              if (err) {
                console.log("Error while updating", err);
              }
              broadcastItems();
            }
          );
          break;
        case "delete":
          db.query("DELETE FROM USER WHERE id=? ", [data.id], (err) => {
            if (err) {
              console.log("Error while deleting", err);
            }
            broadcastItems();
          });
        // items.items.filter((item) => item.id !== data.id);
      }

      // Broadcast
      const broadcastItems = () => {
        db.query("SELECT * FROM USER", (err, results) => {
          if (err) {
            console.error("Error fetching updated items:", err);
            return;
          }
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "read", data: results }));
            }
          });
        });
      };
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
