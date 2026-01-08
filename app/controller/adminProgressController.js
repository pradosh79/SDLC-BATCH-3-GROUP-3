const Progress = require("../model/progressModel");

class AdminProgressController {

  async index(req, res) {
    const progress = await Progress.find()
      .populate("user")
      .populate("lesson");

    res.render("admin/progress/index", { progress, admin: req.user });
  }
}

module.exports = new AdminProgressController();
