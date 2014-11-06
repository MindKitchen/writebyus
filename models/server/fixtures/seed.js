"use strict";

var users = [
  { name: "Author", email: "author@writeby.us", roles: [], password: "author!" },
  { name: "Admin", email: "admin@writeby.us", roles: ["admin"], password: "admin!" }
];

var stories = [
  { "name" : "Bel-Air", "time": "Mon Sep 10 1990 20:00:00 GMT-0700" },
  { "name" : "The Corpse is Exquisite" },
];

var sentences = [
  { "storyId": "Bel-Air", "text": "Now, this is a story all about how" },
  { "storyId": "Bel-Air", "text": "My life got flipped-turned upside down" },
  { "storyId": "Bel-Air", "text": "And I'd like to take a minute" },
  { "storyId": "Bel-Air", "text": "Just sit right there" },
  { "storyId": "Bel-Air", "text": "I'll tell you how I became the prince of a town called Bel Air" },
  { "storyId": "Bel-Air", "text": "In west Philadelphia born and raised" },
  { "storyId": "Bel-Air", "text": "On the playground was where I spent most of my days" },
  { "storyId": "Bel-Air", "text": "Chillin' out maxin' relaxin' all cool" },
  { "storyId": "Bel-Air", "text": "And all shootin some b-ball outside of the school" },
  { "storyId": "Bel-Air", "text": "When a couple of guys who were up to no good" },
  { "storyId": "Bel-Air", "text": "Started making trouble in my neighborhood" },
  { "storyId": "Bel-Air", "text": "I got in one little fight and my mom got scared" },
  { "storyId": "Bel-Air", "text": "She said 'You're movin' with your auntie and uncle in Bel Air'" },
  { "storyId": "The Corpse is Exquisite", "text": "The corpse is exquisite, filled with potential." },
];

Meteor.startup(function() {
  if (Meteor.users.find().count() === 0) {
    users.forEach(function (user) {
      console.log("Seeding user: ", user);
      var id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: { name: user.name }
      });

      if (user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
      }
    });
  }

  if (Stories.find().count() === 0) {
    stories.forEach(function (story) {
      story.ownerId = Meteor.users.findOne()._id;
      story.status = story.status || "open";
      story.time = new Date(story.time) || Date.now();
      story.timeout = story.timeout || 45;
      story.clock = story.clock || 45;

      console.log("Seeding story: ", story);
      Stories.insert(story);
    });
  }

  if (Sentences.find().count() === 0) {
    sentences.forEach(function (sentence) {
      Stories.find({ name: sentence.storyId }).forEach(function (story) {
        sentence.storyId = story._id;
        sentence.status = "accepted";
        sentence.accepted = Date.now();
        sentence.ownerId = Meteor.users.findOne()._id;
        console.log("Seeding sentence: ", sentence);
        Sentences.insert(sentence);
      });
    });
  }
});
