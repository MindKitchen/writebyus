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
          //console.log("p ", p);
          //console.log("c ", c);
          // Find the sentence with the most votes
          return (c.votes < p.votes) ? p : c;
        }, { _id: null, vote: -1 });

      //console.log("winner ", winner);

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

      // Update next interval 
      Stories.update(story._id, {
        $set: {
          interval: Date.now() + story.timeout
        }
      });
    };

    story.interval = Date.now() + story.timeout;
    Meteor.setInterval(selectWinner, story.timeout);

    story._id = Stories.insert(story);
    return story._id;
  }
});
