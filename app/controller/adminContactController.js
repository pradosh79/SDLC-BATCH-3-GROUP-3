const Contact = require("../model/contactModel");
const ContactInfo = require("../model/contactInfoModel");



class contactApiController {
/**
 * CONTACT MESSAGES LIST
 */
async contactList(req, res){
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res.render("admin/contacts", {
        title: "Contact List",
        admin: req.user,
        contacts: contacts
      });
}

/**
 * CONTACT INFO PAGE
 */
async contactInfoPage(req, res){
  const info = await ContactInfo.findOne();
  return res.render("admin/contact-info", {
        title: "Contact List",
        admin: req.user,
        info: info
      });
}

/**
 * UPDATE CONTACT INFO
 */
async updateContactInfo(req, res){
  const { email, phone, address, mapEmbedUrl } = req.body;

  await ContactInfo.findOneAndUpdate(
    {},
    { email, phone, address, mapEmbedUrl },
    { upsert: true }
  );

  res.redirect("/admin/contact-info");
};

/**
 * DELETE CONTACT MESSAGE
 */
async deleteContact(req, res){
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect("/admin/contacts");
}

}

module.exports = new contactApiController();