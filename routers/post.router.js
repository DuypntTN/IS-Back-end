const express = require("express");
const {
  createPost,
  getPostList,
  getPostDetail,
  approvePost,
  changePostInfo,
  deletePost,
} = require("../repositories/PostRepositories");

const postRouter = express.Router();

postRouter.get("/info/:id", (req, res) => {
  const post_id = req.params.id;
  getPostDetail(post_id)
    .then((post) => {
      res.send(post);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

postRouter.get("/postlist", (req, res) => {
  const filter = req.body;
  console.log(filter);
  getPostList(filter)
    .then((postList) => {
      res.send(postList);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

postRouter.post("/createpost", (req, res) => {
  const post = req.body;
  createPost(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (typeof err == "object") {
        res.status(400).send(err.message);
      }
      res.status(400).send(err);
    });
});

postRouter.post("/changeinfo", (req, res) => {
  const postInfo = req.body;
  changePostInfo(postInfo)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (typeof err == "object") {
        res.status(400).send(err.message);
      }
      res.status(400).send(err);
    });
});

postRouter.delete("/deletepost/:postid", (req, res) => {
  const postid = req.params.postid;
  deletePost(postid)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (typeof err == "object") {
        res.status(400).send(err.message);
      }
      res.status(400).send(err);
    });
});

postRouter.post("/approve/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  approvePost(id, userId)
    .then((data) => { })
    .catch((err) => { });
});

module.exports = postRouter;