import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "s1069.lon1.mysecurecloudhost.com",
  port: 465,
  secure: true,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
	logger: true,   // ✅ يطبع خطوات الإرسال
  debug: true, 
})

export default transporter