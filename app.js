require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const initDatabase = require("./db/init");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static("public"));

const dbConfig = {
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
 port: process.env.DB_PORT || 3306,
 ssl: {
   rejectUnauthorized: false
 }
};

async function startApp() {
await initDatabase(dbConfig);

const pool = mysql.createPool(dbConfig);

app.get("/api/tasks", async (req, res) => {
try {
    const [rows] = await pool.query("SELECT * FROM tasks ORDER BY due_date DESC");
res.json(rows);

}catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
    }
});


app.post("/api/tasks", async (req, res) => {
try{

    const { title ,description,due_date } = req.body;

await pool.query(
`INSERT INTO tasks (title, description, completed, due_date) VALUES (?, ?, false, ?)`, [title, description, due_date]);

res.status(201).json({ message: "Created" });
}catch (error){
    res.status(500).json({ error: "Error creating task" });
}
 });

app.delete("/api/tasks/:id", async (req, res) => {
    try{
await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
res.json({ message: "Deleted" });
    }catch(error){
        res.status(500).json({ error: "Error deleting task" });
    }
 });

app.put("/api/tasks/:id/toggle", async (req, res) => {
    try{
await pool.query(`UPDATE tasks  SET completed = NOT completed  WHERE id = ?`, [req.params.id]);
res.status(201).json({ message: "Updated" });
    }catch (error){
        res.status(500).json({ error: "Error updating tasks" });
    }
 });

app.listen(process.env.PORT, () => {
console.log("Server running");
 });
}

startApp();
