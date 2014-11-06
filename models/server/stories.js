Meteor.publish("stories", function () {
  return Stories.find();
});

var selectWinner = function (story) {
  // Find the winning sentence
  var winner = Sentences.find({
      storyId: story._id,
      status: "pending"
    })
    .fetch()
    .map(function (sentence) {
      // Tally votes for each sentence
      return {
        _id: sentence._id,
        votes: Object.keys(sentence.voters).map(function (voter) {
            return sentence.voters[voter] % 2;
          }).reduce(function (p, c) { return p + c; }, 0)
      };
    }).reduce(function (p, c) {
      // Find the sentence with the most votes
      return (c.votes < p.votes) ? p : c;
    }, { _id: null, vote: -1 });

  // Accept winner
  Sentences.update({ _id: winner._id }, {
    $set: {
      status: "accepted",
      accepted: Date.now()
    }
  });

  // Change status of remaining pending sentences to rejected
  Sentences.update({
    storyId: story._id,
    status: "pending"
  }, {
    $set: {
      status: "rejected"
    }
  }, {
    multi: true
  });
};

Meteor.methods({
  createStory: function (story) {
    story._id = Stories.insert(story);
    Meteor.call("startClock", story);
    return story._id;
  },
  startClock: function (story) {
    // Start (or restart) the clock!
    story.clock = story.clock || story.timeout;
    var interval = Meteor.setInterval(function tick () {
      story.clock--;
      Stories.update(story._id, story);

      if (story.clock <= 0) {
        selectWinner(story);
        // Reset the clock
        story.clock = story.timeout + 1;
      }
    }, 1000);

    console.log("Started clock for ", story.name);
  }
});
