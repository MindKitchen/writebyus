Sentences = new Mongo.Collection("sentences");

Sentences.allow({
  insert: function (userId, doc) {
    return true;
  },
  remove: function (userId, doc) {
    return doc.owner === Meteor.userId();
  }
});
