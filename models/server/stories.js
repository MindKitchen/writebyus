Meteor.publish("stories", function () {
  return Stories.find();
});

Meteor.methods({
  createStory: function (story) {
    var selectWinner = function () {
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

    // Start the clock!
    story.clock = story.timeout;
    var interval = Meteor.setInterval(function tick () {
      story.clock--;
      Stories.update(story._id, story);

      if (story.clock <= 0) {
        selectWinner();
        // Reset the clock
        story.clock = story.timeout + 1;
      }
    }, 1000);

    story._id = Stories.insert(story);
    return story._id;
  }
});
