const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS usa false
  auth: {
    user: "moneymapinvest1@gmail.com",
    pass: "ayzo qoan oyve ioqd" // senha ou App Password
  },
  tls: {
    rejectUnauthorized: false // às vezes necessário para STARTTLS
  }
});

async function sendRecoveryCode(email, code) {
  const info = await transporter.sendMail({
    from: `"RotaPadel" <moneymapinvest1@gmail.com>`,
    to: email,
    subject: "Código de recuperação de senha",
    text: `Seu código de recuperação é: ${code}. Ele expira em 10 minutos.`,
    html: `<p>Seu código de recuperação é: <b>${code}</b></p><p>Ele expira em 10 minutos.</p>`
  });

  console.log("Mensagem enviada:", info.messageId);
}

module.exports = { sendRecoveryCode };
