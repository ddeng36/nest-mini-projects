const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
        user: '1923037702@qq.com',
        pass: '1'
    },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"ddc" <1923037702@qq.com>',
    to: "dingchaodeng@vip.qq.com",
    subject: "Hello 111", 
    text: "xxxxx"
  });

  console.log("邮件发送成功：", info.messageId);
}

main().catch(console.error);
