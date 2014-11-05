Template.storyList.helpers({
  stories: function () {
    return Stories.find();
  },
  introductionDismissed: function () {
    return Session.get("introduction:dismissed") ? "wbu-introduction--dismissed" : "";
  }
});

var dismissIntroduction = function (e) {
  e.preventDefault();
  Session.set("introduction:dismissed", true);
  Template.newStory.resize();
};

Template.storyList.events({
  "click .wbu-introduction__close": dismissIntroduction,
  "click .wbu-introduction__gotit": dismissIntroduction
});

Template.newStory.resize = function () {
  var iconWidth = $(".wbu-form i").outerWidth();
  $(".wbu-form input")
    .width($(window).width() - (iconWidth * 3.25));
  $(".wbu-stories")
    .height(
      $(window).height() -
      $(".wbu-form").outerHeight() -
      $(".wbu-header").outerHeight() -
      (Session.get("introduction:dismissed") ? 0 : $(".wbu-introduction").outerHeight())
    );
};

Template.newStory.rendered = function () {
  $(window).resize(Template.newStory.resize);
  Template.newStory.resize();
};


Template.newStory.events({
  "submit form": function (e) {
    e.preventDefault();

    var newStory = {
      name: $(e.target).find("[name=name]").val(),
      ownerId: Meteor.userId(),
      status: "open",
      time: Date.now(),
      timeout: 45
    };

    Meteor.call("createStory", newStory, function (error, result) {
      newStory._id = result;
      Session.set("currentStory", newStory._id);
      Router.go("write", { _id: newStory._id });
    });
  }
});
