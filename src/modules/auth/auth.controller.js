import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppError, catchAsyncError } from '../../utils/error.handler.js'
import userModel from '../user/models/user.model.js'
import transporter from '../../utils/email.js'
 dotenv.config()
export const signin = catchAsyncError(async (req, res) => {
	const { email, password } = req.body
	const user = await userModel.findOne({ email })
       
		
	if (!user || !bcrypt.compareSync(password, user.password))
		throw new AppError('Invalid credentials', 400)

	const { name, role, _id: id } = user
	const token = jwt.sign({ name, role, id, email }, process.env.SECRET)
	res.json({ token , message:"signed in successfully" })
})

export const signup = catchAsyncError(async (req, res) => {
	const { companyName, email, password } = req.body
	const hashed = bcrypt.hashSync(password , +process.env.SALT)
	const token = jwt.sign({ email }, process.env.EMAIL_PASS)
   

	await userModel.create({
		companyName,
		email,
		password: hashed,
	})
	res.status(201).json({ message: 'Signed up successfully' })
})

export const validateEmail = catchAsyncError(async (req, res) => {
	const { token } = req.params
	try {
		const decoded = jwt.verify(token)
		const { email } = decoded
		await userModel.findOneAndUpdate({ email }, { email_verified: true })
		res.json({ message: 'Email verified successfully' })
	} catch (error) {
		throw new AppError(error.message, 400)
	}
})

export const getUsers = catchAsyncError(async (req, res) => {
	const users = await userModel.find()
	res.json({ users })
})
