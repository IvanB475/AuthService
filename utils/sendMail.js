const nodemailer = require("nodemailer");
const got = require("got");
const FormData = require("form-data");

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
    return mail;
  } catch (e) {
    throw new Error(e);
  }
};

exports.sendMailViaApi = async (email, token, secret) => {
  const form = new FormData();

  form.append("email", email);
  form.append("token", token);
  form.append("authorization", secret);

  try {
    const response = await got.post("Glupost.php", {
      prefixUrl: "http://moje-puzzle.com/mailer",
      body: form,
    });
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "mail couldn't be sent" });
  }
};
