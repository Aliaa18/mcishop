import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "https://s1069.lon1.mysecurecloudhost.com",
  port: 465,
  secure: true,
	auth: {
		user:"alaa.mohamed@mci-egypt.com",
		pass:"jlzuohiawocevnuu",
	},
	
})

export default transporter