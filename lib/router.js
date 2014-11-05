Router.configure({
  layoutTemplate: "layout"
});

Router.route("/", function () {
  GAnalytics.pageview();
  this.render("home");
}, { name: "home" });
Router.route("/write/:_id", function () {
  GAnalytics.pageview();
  this.render("write");
}, {
  name: "write",
  data: function () { return Stories.findOne(this.params._id); } 
});
