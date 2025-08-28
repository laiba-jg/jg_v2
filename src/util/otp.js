import crypto from 'crypto';
import logger from './logger.js';
import SendOTPError from '../errors/SendOTPError.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

export function generateOTP() {
    const otp = crypto.randomInt(1000, 10000); // 1000 to 9999 inclusive
    return otp.toString();
}

export async function sendSMS(phone, otp) {
    try {
        const message = `Your OTP code is ${otp}, Do not share this with anyone.
     Just gold or its representatives will never ask you for OTP.`;
        await client.messages.create({
            body: message,
            from: twilioPhone,
            to: phone.countryCode + phone.number
        });
    } catch (err) {
        logger.error(err);
        throw new SendOTPError();
    }
}

export async function sendEmailOTP(email, otp, otpExpiryMinutes,type){
  try {

    const date = new Date();
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const msg = {
      to: email,
      from: {
        name: "Just Gold",
        email: "no-reply@justgold.me" 
      },
      //type = 'login' | 'registration' | 'reset' | 'resend'
      subject: `OTP Verification for ${type.charAt(0).toUpperCase() + type.slice(1)} on Just Gold`,
      text: '',
      html: generateEailTemplate(otp,otpExpiryMinutes,type)
    }


    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending email:', error.response.body);
      });


  } catch (err) {
        logger.error(err);
        throw new SendOTPError();
    }
}
//todo optimize it
const generateEailTemplate = (otp, otpExpiryMinutes, otpType = "verification") => {

  const purposeText = {
      registration: "to complete your registration process",
      login: "to securely log into your account",
      reset: "to reset your password",
      resend: "as your OTP has been resent",
      verification: "to verify your identity",
  };

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Just Gold OTP Email</title>
    <style>
        body, table, td, a {
            font-family: Arial, sans-serif;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        table {
            border-spacing: 0;
        }
        img {
            border: 0;
            max-width: 100%;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 0px 40px;
            border-radius: 8px;
        }
        .header {
            background: #1A3C79;
            color: #ffffff;
            text-align: left;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
        }
        .header span {
            display: block;
            font-size: 14px;
            font-weight: normal;
        }
        .logo {
            text-align: right;
            padding: 15px;
            background: #1A3C79;
        }
        .logo img {
            height: 40px;
        }
        .content {
            padding: 20px;
            color: #333;
            font-size: 16px;
        }
        .otp-code {
            font-size: 22px;
            font-weight: bold;
            color: #1A3C79;
        }
        .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            padding: 15px;
        }
        /* Responsive Design */
        @media screen and (max-width: 600px) {
            .container {
                width: 90%;
            }
            .header {
                font-size: 18px;
            }
            .content {
                font-size: 14px;
            }
            .otp-code {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">
                <table class="container">
                    <!-- Header Section -->
                    <tr>
                        <td class="header">
                            "Digital Gold <br>
                            <span>Safe, Smart, Eternal."</span>
                        </td>
                        <td class="logo">
                            <img src="https://s3.ap-southeast-1.amazonaws.com/justgold.me/images/white_justgold.png" alt="Just Gold">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="content">
                            <p>Dear Customer,</p>
                            <p>Your One Time Password (OTP) for <b>${otpType.toUpperCase()}</b> is:</p>
                            <p class="otp-code">${otp}</p>
                            <p>This password is valid for <b>${otpExpiryMinutes}</b> minutes only. Never share your OTP with anyone.</p>
                            <p>Please contact Just Gold at <b>+971 58 936 1909</b> if you did not initiate this.</p>
                            <p>Regards,<br><b>Just Gold LLC-FZ</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="footer">
                            <p><strong>DISCLAIMER:</strong> This email and any attachments are confidential and may be privileged. 
                            It is intended only for the use of authorized persons. If you are not an addressee, or have received the message in error, 
                            you are not authorized to read, copy, disseminate, distribute or use this email in any way. 
                            Please notify the sender by return email and delete this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
};