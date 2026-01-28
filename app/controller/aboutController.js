const About =require("../model/aboutModel");

class AboutController {

  // GET /admin/about
  async list(req, res) {
    try {
      const abouts = await About.find();
      return res.render("admin/about/list", {
        title: "About List",
        admin: req.user,
        abouts: abouts
      });  


    } catch (err) {
      res.status(500).send("Server Error");
    }
  }

  //Store
  async store(req, res) {
    try {
      const {
        welcomeTitle,
        welcomeDescription,
        visionTitle,
        visionDescription
      } = req.body;

      await About.create({
        welcomeTitle,
        welcomeDescription,
        visionTitle,
        visionDescription
      });

      // after save redirect to list
      res.redirect("/admin/about");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  // GET /admin/about/create
  createPage(req, res) {
    return res.render("admin/about/create", {
        title: "About List",
        admin: req.user
      });
  }

  // POST /admin/about
  async create(req, res) {
    try {
      await About.create(req.body);
      res.redirect("/admin/about");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  // GET /admin/about/edit/:id
  async editPage(req, res) {
    try {
      const about = await About.findById(req.params.id);
      res.render("about/edit", { about });
    } catch (err) {
      res.status(404).send("Not Found");
    }
  }

  // POST /admin/about/update/:id
  async update(req, res) {
    try {
      await About.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/admin/about");
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  // POST /admin/about/delete/:id
  async delete(req, res) {
    try {
      await About.findByIdAndDelete(req.params.id);
      res.redirect("/admin/about");
    } catch (err) {
      res.status(500).send("Delete failed");
    }
  }

  // Show Trusted By page
async trustedByPage(req, res) {
  const about = await About.findOne();
  return res.render("admin/about/trustedby", {
        title: "About List",
        admin: req.user,
        about: about
      });
}

// Add logo
async addTrustedBy(req, res) {
  await About.findOneAndUpdate(
    {},
    { $push: { trustedBy: req.body.logo } }
  );
  res.redirect("/admin/about/trustedby");
}

// Delete logo
async deleteTrustedBy(req, res) {
    console.log(req.params.index);
  const index = parseInt(req.params.index);

  const about = await About.findOne();

  if (!about || !about.trustedBy[index]) {
    return res.redirect("/admin/about/trustedby");
  }

  about.trustedBy.splice(index, 1);
  await about.save();

  res.redirect("/admin/about/trustedby");
}

// List testimonials
async testimonialsPage(req, res) {
  const about = await About.findOne();
  return res.render("admin/about/testimonials", {
        title: "About List",
        admin: req.user,
        about: about
      });
}

// Store testimonial
async addTestimonial(req, res) {
  await About.findOneAndUpdate(
    {},
    { $push: { testimonials: req.body } }
  );
  res.redirect("/admin/about/testimonials");
}

// Delete testimonial
async deleteTestimonial(req, res) {
  await About.findOneAndUpdate(
    {},
    { $pull: { testimonials: { _id: req.params.id } } }
  );
  res.redirect("/admin/about/testimonials");
}


}

module.exports = new AboutController();