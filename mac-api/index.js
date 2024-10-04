import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import os from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

dotenv.config();
const PORT = process.env.PORT || 3001;

app.get("/api/mac", (req, res) => {
  try {
    const networkInterfaces = os.networkInterfaces();
    const macAddresses = [];

    for (const intf in networkInterfaces) {
      for (const alias of networkInterfaces[intf]) {
        if (alias.family === "IPv4" && !alias.internal) {
          macAddresses.push(alias.mac);
        }
      }
    }

    res.json(macAddresses);
  } catch (error) {
    console.error("Error fetching MAC addresses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
