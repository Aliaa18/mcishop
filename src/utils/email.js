import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
     service:'gmail',
	auth: {
		user: "aliaasultan75@gmail.com",
		pass: "fewn tqrg vpeq umxv",
	},
})

export default transporter