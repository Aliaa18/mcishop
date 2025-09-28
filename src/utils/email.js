import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'gmail',
	auth: {
		user: "aliaasultan75@gmail.com",
		pass: "ymse namv tnmm lsva",
	},
})

export default transporter