import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'outlook',
	auth: {
		user: process.env.EMAIL,
		pass: "jlzuohiawocevnuu",
	},
})

export default transporter