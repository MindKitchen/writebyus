Meteor.startup(function() {
  Stories.find().forEach(function (story) {
    Meteor.call("startClock", story);
  });
});
