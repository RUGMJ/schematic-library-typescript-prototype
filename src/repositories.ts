import Schematic from "Models/Schematic";
import Post from "./Models/Post.js";
import Comment from "Models/Comment";


class NotFound extends Error {
  constructor() {
    super();
    this.name = "NotFound";
  }
}

const getPostById = async (id: String) => {
  const post = await Post.findById(id);
  if (!post) throw new NotFound();
  return post;
};

const getAllPosts = async () => {
  const posts = await Post.find();
  return posts;
};

const createPost = async (title: String, schematicData: Buffer) => {
  const schematic = new Schematic({ data: schematicData });
  await schematic.save();

  const post = new Post({ title, schematic: schematic._id });
  await post.save();

  return post;
};

const addCommentToPost = async (postId: String, content: String) => {
  const post = await Post.findById(postId);
  if (!post) throw new NotFound()

  const comment = new Comment({ content });
  await comment.save();

  post.comments.push(comment._id);
  await post.save();

  return comment;
};

export { getPostById, getAllPosts, createPost, addCommentToPost, NotFound }
