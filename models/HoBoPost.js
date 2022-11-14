const Model = require("./Model");

class HoBoPost extends Model {
  constructor() {
    super();
    this.title = null;
    this.description = null;
    this.image = null;
    this.location = null;
    this.date = null;
    this.time = null;
    this.userId = null;
    this.hotelName = null;
    this.isApproved = null;
  }
}
module.exports = HoBoPost;