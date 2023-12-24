// server.js
const express = require("express");
const fs = require("fs/promises");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001; // Use the dynamic port provided by Netlify

// Your other Express configurations and routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/api/data", async (req, res) => {
  try {
    const data = await fs.readFile("data.json", "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const newData = req.body;
    const currentData = JSON.parse(await fs.readFile("data.json", "utf8"));
    const updatedData = [...currentData, newData];
    await fs.writeFile("data.json", JSON.stringify(updatedData, null, 2));
    res.json(updatedData);
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const currentData = JSON.parse(await fs.readFile("data.json", "utf8"));
    const updatedData = currentData.filter((item) => item.id !== id);
    await fs.writeFile("data.json", JSON.stringify(updatedData, null, 2));
    res.json(updatedData);
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
