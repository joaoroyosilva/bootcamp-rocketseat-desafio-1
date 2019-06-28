const express = require("express");

const server = express();

server.use(express.json());

let count = 0;
let projects = [];

server.use((req, res, next) => {
  count++;
  console.log(`Total requests: ${count}`);
  next();
});

function checkId(req, res, next) {
  const { id } = req.params;

  let project = projects.find(proj => proj.id == id);

  if (!project && id)
    return res.status(404).json({ error: "Project not find" });

  next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.post("/projects/:id/tasks", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(proj => proj.id == id);
  project.tasks.push(title);
  return res.json(project);
});

server.put("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(proj => proj.id == id);
  project.title = title;
  return res.json(projects);
});

server.delete("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  let index = projects.findIndex(proj => proj.id == id);
  projects.splice(index, 1);
  return res.json("ok");
});

server.get("/", (req, res) => {
  return res.json({ message: "Project deleted" });
});

server.listen(3000);
