const Contact = require("../../model/contactModel");

class contactApiController {

    /**
 * POST: Submit Contact Form
 */
async createContact(req, res){
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact
    });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

/**
 * GET: All Contact Messages (Admin)
 */
async getAllContacts(req, res){
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

}
module.exports = new contactApiController();