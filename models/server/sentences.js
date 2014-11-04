Meteor.publish("sentences", function () {
  return Sentences.find();
});

Meteor.methods({
  vote: function (sentence) {
    var update = { $inc: {} };
    // Increment the key 'voters.userId' by one for each vote
    update.$inc["voters." + Meteor.userId()] = 1;
    Sentences.update(sentence._id, update);
  }
});
