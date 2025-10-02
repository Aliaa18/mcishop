import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'outlook',
	auth: {
		user: "alaa.mohamed@mci-egypt.com",
		pass: "jlzuohiawocevnuu",
	},
})

export default transporter