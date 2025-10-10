import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "s1069.lon1.mysecurecloudhost.com",
  port: 465,
  secure: true,
	auth: {
		user:"alaa.mohamed@mci-egypt.com",
		pass:"jlzuohiawocevnuu",
	},
	tls: {
    rejectUnauthorized: false, // مفيدة لو السيرفر مش موثّق بالكامل
  },
})

export default transporter