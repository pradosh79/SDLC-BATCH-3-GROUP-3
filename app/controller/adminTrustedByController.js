const TrustedBy = require("../model/trustedByModel");
const deleteCloudinaryImage = require("../helper/deleteCloudinaryImage");

class AdminTrustedByController {

  // LIST
  async index(req, res) {
    const logos = await TrustedBy.find().sort({ position: 1 });
    res.render("admin/about/trustedby/index", {
      logos,
      admin: req.user
    });
  }

  // CREATE
  async store(req, res) {
  try {
    console.log("FILE =>", req.file); 

    if (!req.file || !req.file.path) {
      return res.status(400).send("Logo image required");
    }

    await TrustedBy.create({
      companyName: req.body.companyName,
      website: req.body.website,
      logo: req.file.path,   // ✅ MUST be .path
      position: req.body.position || 0
    });

    res.redirect("/admin/about/trustedby");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
}

  // UPDATE
  async update(req, res) {
    try {
      const logo = await TrustedBy.findById(req.params.id);
      if (!logo) return res.redirect("/admin/about/trustedby");

      const updateData = {
        companyName: req.body.companyName,
        website: req.body.website,
        position: req.body.position,
        isActive: req.body.isActive === "on"
      };

      // ✅ New logo uploaded
      if (req.file && req.file.path) {
            await deleteCloudinaryImage(logo.logo);
            updateData.logo = req.file.path;
          }

      await TrustedBy.findByIdAndUpdate(req.params.id, updateData);
      res.redirect("/admin/about/trustedby");

    } catch (error) {
      console.error(error);
      res.status(500).send("Update failed");
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      await TrustedBy.findByIdAndDelete(req.params.id);
      res.redirect("/admin/about/trustedby");
    } catch (error) {
      console.error(error);
      res.status(500).send("Delete failed");
    }
  }
}

module.exports = new AdminTrustedByController();
