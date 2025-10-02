import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'gmail',
	auth: {
		user: "ms8159974@gmail.com",
		pass: "mlam xixd dgvg vjdk",
	},
})

export default transporter