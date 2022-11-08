const Model = require("./Model");

class Comments extends Model {
  constructor() {
    super();
    this.comment = null;
    this.userId = null;
    this.postId = null;
    this.isHide = null;
  }
}

module.exports = Comments;
