Router.configure({
  layoutTemplate: "layout"
});

Router.route("/", { name: "home" });
Router.route("/write/:_id", {
  name: "write",
  data: function () { return Stories.findOne(this.params._id); } 
});
