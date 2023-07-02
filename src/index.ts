import express from 'express';
import mongoose from 'mongoose';
import config from './config.json' assert {type: 'json'};
import Schematic from './Models/Schematic.js';
import Post from './Models/Post.js';

const app = express();
app.use(express.json());

await mongoose.connect(config.mongo);

const v1 = express.Router();

v1.get("/post/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ error: "Incorrect id" });

  const post = await Post.findById(id).populate("schematic").exec();
  if (!post) return res.status(404).send({ error: "No post with that id was found" })

  res.send(post);
})

v1.get("/posts", async (_, res) => {
  const posts = await Post.find();
  res.send(posts);
})

v1.post("/post", async (req, res) => {
  const schematic = new Schematic({ data: req.body.schematic });
  await schematic.save();
  const post = new Post({ title: req.body.title, schematic: schematic._id })
  await post.save();
  res.send(post);
})

app.use("/v1.0.0/", v1);

app.listen(3000);
