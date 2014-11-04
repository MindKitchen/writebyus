Template.write.helpers({
  sentences: function () {
    return Sentences.find({ storyId: this._id, status: { $ne: "rejected" } });
  }
});

Template.enterSentence.resize = function () {
  var iconWidth = $(".wbu-form i").outerWidth();
  $(".wbu-form input")
    .width($(window).width() - (iconWidth * 3.25));
  $(".wbu-story")
    .height($(window).height() - $(".wbu-form").height() - $(".wbu-header").outerHeight());
  // Voodoo! Fixes yet to be determined case where iconWidth is initially...way too big
  $(".wbu-form input")
    .width($(window).width() - (iconWidth * 3.25));
};

Template.enterSentence.rendered = function () {
  $(window).resize(Template.enterSentence.resize);
  Template.enterSentence.resize();
};

Template.enterSentence.helpers({
  disabled: function () {
    return Meteor.userId() ? "" : "disabled";
  }
});

Template.sentence.helpers({
  status: function () {
    return "sentence--" + this.status;
  },
  owner: function () {
    return Meteor.users.findOne({ _id: this.ownerId });
  },
  author: function () {
    var user = Meteor.users.findOne({ _id: this.ownerId });
    return user && user.profile && user.profile.name || user && user.username || "";
  },
  voted: function () {
    var query = {
      _id: this._id
    };
    query["voters." + Meteor.userId()] = { $mod: [2,1] };
    return Sentences.findOne(query) ? "sentence--voted" : "";
  },
  votes: function () {
    var self = this;
    return Object.keys(this.voters).map(function (voter) {
      return self.voters[voter] % 2;
    }).reduce(function (p, c) { return p + c; }, 0);
  }
});

Template.write.events({
  "submit form": function (e) {
    e.preventDefault();

    var newSentence = {
      text: $(e.target).find("[name=text]").val(),
      storyId: this._id,
      ownerId: Meteor.userId(),
      status: "pending",
      time: Date.now(),
      voters: {}
    };

    newSentence._id = Sentences.insert(newSentence);
    $(e.target).find("[name=text]").val("");
  },
  "click .fa-pencil": function (e) {
    e.preventDefault();
    $("input[name=text]").focus();
  }
});

Template.sentence.events({
  "click .sentence--pending": function (e) {
    e.preventDefault();
    Meteor.call("vote", this);
  }
});
