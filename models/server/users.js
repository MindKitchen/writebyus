Meteor.publish(null, function () {
  return Meteor.users.find({}, {
    username: true,
    profile: true
  });
});
