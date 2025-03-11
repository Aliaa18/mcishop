import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
  port: 587, // or 465 if using secure
  secure: false, 
	auth: {
		user: "aliaasultan75@gmail.com",
		pass: "vxpe mddb zbsf ksfg",
	},
})

export default transporter