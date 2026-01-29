const Category = require("../model/categoryModel");


class adminCategoryController {
/**
 * LIST CATEGORIES
 */
async index(req, res){
  const categories = await Category.find().sort({ createdAt: -1 });
  res.render("admin/categories/index", {
    title: "Categories",
    admin: req.user,
    categories
  });
};

/**
 * SHOW CREATE FORM
 */
async createPage(req, res){
  res.render("admin/categories/create", {
    title: "Add Category",
    admin: req.user
  });
};

/**
 * STORE CATEGORY
 */
async store(req, res){
  const { name, description, icon, isActive } = req.body;

  await Category.create({
    name,
    description,
    icon,
    isActive: isActive === "on"
  });

  res.redirect("/admin/categories");
};

/**
 * SHOW EDIT FORM
 */
async editPage(req, res){
  const category = await Category.findById(req.params.id);

  res.render("admin/categories/edit", {
    title: "Edit Category",
    admin: req.user,
    category
  });
};

/**
 * UPDATE CATEGORY
 */
async update(req, res){
  const { name, description, icon, isActive } = req.body;

  await Category.findByIdAndUpdate(req.params.id, {
    name,
    description,
    icon,
    isActive: isActive === "on",
    slug: name.toLowerCase().replace(/\s+/g, "-")
  });

  res.redirect("/admin/categories");
};

/**
 * DELETE CATEGORY
 */
async destroy(req, res){
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/admin/categories");
};

}
module.exports = new adminCategoryController();