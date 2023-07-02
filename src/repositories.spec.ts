import sinon from "sinon";
import { assert, expect } from "chai";
import Schematic from "./Models/Schematic.js";
import Post from "./Models/Post.js";
import Comment from "./Models/Comment.js";
import {
  getPostById,
  getAllPosts,
  createPost,
  addCommentToPost,
  NotFound
} from "./repositories.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Document } from 'mongoose';


let mongoServer: MongoMemoryServer;

let examplePost: Document;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  ["Full Adder", "Red Coder", "2x2 Lamp Pixel", "Vertical Display"].forEach(async title => {
    const schematic = new Schematic({ data: [0, 1, 2, 3, 4] });
    await schematic.save();
    const post = new Post({ title, schematic: schematic._id })
    await post.save()
    examplePost = post.toObject();
  })

})

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("getPostById", () => {
  it("should return the post with the specified ID", async () => {
    const post = await getPostById(examplePost._id);
    expect(post._id === examplePost._id);
  })

  it("should throw NotFound error if no post with the specified ID is found", async () => {
    assert.throws(() => {
      getPostById("notarealid");
    })
  });
});

describe("getAllPosts", () => {
  it("should return an array of all posts", async () => {
    const posts = await getAllPosts();

    expect(posts[0].title === "Full Adder")
    expect(posts[1].title === "Red Coder")
    expect(posts[2].title === "2x2 Lamp Pixel")
  });
});

describe("createPost", () => {
  it("should create a new post with the provided title and schematic", async () => {
    const post = await createPost("Example Title", Buffer.from([0, 1, 2, 3]));
    expect(post.title === "Example Title")
  });
});

describe("addCommentToPost", () => {
  it("should add a new comment to the post with the provided ID", async () => {
    const comment = await addCommentToPost(examplePost._id, "Example Comment")
    expect(comment.content === "Example Content");
  });

  it("should throw NotFound error if no post with the specified ID is found", async () => {
    assert.throws(async () => {

      await addCommentToPost("not a real id", "Example Comment")

    })
  });
});
