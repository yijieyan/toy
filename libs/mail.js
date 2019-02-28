const nodemailer = require('nodemailer');
let { user, pwd } = require('../config.js').mail;
let sendCode = (to, html, text = '') => {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        global.logs.error(`发送邮件失败:${err}`);
        reject(err);
      }

      let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user, // generated ethereal user
          pass: pwd // generated ethereal password
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: user,
        to,
        subject: '一封暖暖的邮件', // Subject line
        text,
        html
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          global.logs.error(`发送邮件失败:${error}`);
          reject(error);
        }
        resolve();
      });
    });
  });
};

module.exports = {
  sendCode
};