const nodemailer = require('nodemailer');


class MailService {
  constructor(DraftOrder = null) {
    this.draftOrder = DraftOrder;
  }


  /**
   *
   * @param toEmail
   * @param subject
   * @param message
   * @param sendEmail
   */
  sendEmail(toEmail = 'buphmin@gmail.com', subject = 'test', message = 'test', sendEmail = false) {
    //dont send emails to those who don't want.
    if(sendEmail === true) {
      const transport = nodemailer.createTransport({
        host: 'email-smtp.us-west-2.amazonaws.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'AKIAJ5KO23B5CNYSS4SA', // generated ethereal user
          pass: 'AgxJeFNQ+eomD9HPTL0WrkyHacxDSyKbV8LTiI4w7TZe' // generated ethereal password
        }
      });

      const mailOptions = {
        from: 'noreply@fantasydraftplus.net', // sender address
        to: toEmail, // list of receivers
        cc: 'buphmin@gmail.com,popeseveni@gmail.com',
        subject: subject, // Subject line
        text: message, // plain text body
      };

      transport.sendMail(mailOptions)
        .catch(e => {
          console.error(e);
        });
    }
  }
}

exports.MailService = MailService;