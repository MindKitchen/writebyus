// Update client->server clock offset every 5 seconds
Meteor.setInterval(function () {
  Meteor.call("getServerTime", function (error, result) {
    Session.set("clockOffset", result - Date.now());
  });
}, 5000);
