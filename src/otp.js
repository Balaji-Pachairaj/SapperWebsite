// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kurudhiofficial@gmail.com',
    pass: 'vutf jrjw bnpc jire',
  },
});

// Generate and send OTP via email
app.post('/send-otp', async (req, res) => {
  try {
    console.log('Received OTP request');
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: true, specialChars: false });

    // Email configuration
    const mailOptions = {
      from: 'kurudhiofficial@gmail.com',
      to: email,
      subject: 'Login Verification - Your OTP',
      text: "Plaintext version of the message",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your login</title>
    <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
  </head>
  
  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation"
      style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: left;">
                      <div style="padding-bottom: 20px;"><img style="max-width: 100px;" src="/images/logo/logo.PNG" alt="Company"
                          style="width: 56px;"></div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                      <div style="color: rgb(0, 0, 0); text-align: left;">
                        <h1 style="margin: 1rem 0">Verification code</h1>
                        <p style="padding-bottom: 16px">Please use the verification code below to sign in. our Kurudhi login OTP is: </p>
              
                        
                        <p style="padding-bottom: 16px"><strong style="font-size: 130%"> ${otp}</strong></p>
                        <p style="padding-bottom: 16px">Please use this code to sign in securely. If you didn’t request this, you can ignore this email.</p>
                        <p style="padding-bottom: 16px">Thanks,<br>The Mailmeteor team</p>
                      </div>
                    </div>
                    <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                      <p style="padding-bottom: 16px">Made with ♥ in Bumble Bees</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
  
  </html>
  `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Assuming the email was sent successfully
    res.status(200).json({ status: 'success', message: 'OTP sent successfully', otp, info });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to send OTP', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});