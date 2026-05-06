const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let posts = [];

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", (req, res) => {
  const post = { ...req.body, status: "Draft" };
  posts.push(post);
  res.json(post);
});

app.patch("/posts/:id", (req, res) => {
  posts[req.params.id].status = "Active";
  res.json(posts[req.params.id]);
});

app.delete("/posts/:id", (req, res) => {
  posts.splice(req.params.id, 1);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));