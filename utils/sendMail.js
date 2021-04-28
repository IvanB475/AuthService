const nodemailer = require("nodemailer");

exports.sendMail = async (email, title, content) => {
  const gmailUser = process.env.GMAILUSER;
  const gmailPW = process.env.GMAILPW;
  try {
    let smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: gmailUser,
        pass: gmailPW,
      },
    });
    let mailOptions = {
      to: email,
      from: gmailUser,
      subject: title,
      text: content,
    };
    const mail = await smtpTransport.sendMail(mailOptions);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
