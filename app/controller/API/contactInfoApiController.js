const ContactInfo = require("../../model/contactInfoModel");

class contactApiController {
/**
 * GET: Contact Page Info
 */
async getContactInfo(req, res){
  try {
    const info = await ContactInfo.findOne();

    res.json({
      success: true,
      data: info
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * POST / UPDATE: Contact Page Info (Admin)
 */
async upsertContactInfo(req, res){
  try {
    const { email, phone, address, mapEmbedUrl } = req.body;

    const info = await ContactInfo.findOneAndUpdate(
      {},
      { email, phone, address, mapEmbedUrl },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Contact info updated",
      data: info
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

}
module.exports = new contactApiController();