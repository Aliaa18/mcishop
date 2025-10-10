import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     host: "smtp.office365.com",
  port: 587,
  secure: false,
	auth: {
		user:"alaa.mohamed@mci-egypt.com",
		pass:"jlzuohiawocevnuu",
	},
	tls: {
    ciphers: "SSLv3",
  },
})

export default transporter