import express from 'express';
import mongoose from 'mongoose';
import config from './config.json' assert {type: 'json'};
import { getPostById, getAllPosts, addCommentToPost, createPost, NotFound } from './repositories.js';

const app = express();
app.use(express.json());

await mongoose.connect(config.mongo);

const v1 = express.Router();

v1.get("/post/:id", async (req, res) => {
  try {
    res.send(await getPostById(req.params.id));
  } catch (error) {
    if (error instanceof NotFound) return res.status(404).send({ error: "Post not found" })
  }
})

v1.get("/posts", async (_, res) => {
  res.send(await getAllPosts());
})

v1.post("/post", async (req, res) => {
  res.send(await createPost(req.body.title, req.body.schematic.data))
})

v1.post("/comment/:postId", async (req, res) => {
  try {
    res.send(await addCommentToPost(req.params.postId, req.body.content))
  } catch (error) {
    if (error instanceof NotFound) return res.status(404).send({ error: "Post not found" })
  }
})

app.use("/v1.0.0/", v1);

app.listen(3000);
