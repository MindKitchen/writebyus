Stories = new Mongo.Collection("stories");

Stories.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return false;
  }
});
