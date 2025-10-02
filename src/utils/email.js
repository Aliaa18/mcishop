import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'Outlook',
	auth: {
		user: "alaa.mohamed@mci-egypt.com",
		pass: "jlzuohiawocevnuu",
	},
})

export default transporter