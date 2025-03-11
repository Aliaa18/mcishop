import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppError, catchAsyncError } from '../../utils/error.handler.js'
import userModel from '../user/models/user.model.js'
import transporter from '../../utils/email.js'
import { assertCart } from '../cart/middlewares/cart.middleware.js'
 dotenv.config()
export const signin = catchAsyncError(async (req, res) => {
	const { email, password } = req.body
	const user = await userModel.findOne({ email })
       
		
	if (!user || !bcrypt.compareSync(password, user.password))
		throw new AppError('Invalid credentials', 400)

	const { companyName, role, _id: id } = user
	const token = jwt.sign({ companyName, role, id, email }, process.env.SECRET)
     assertCart()
	res.json({ token , message:"signed in successfully" , user })
})

export const signup = catchAsyncError(async (req, res) => {
	const { companyName, email, password , phone } = req.body
	const hashed = bcrypt.hashSync(password , +process.env.SALT)
	const token = jwt.sign({ email }, process.env.EMAIL_PASS)
   

	await userModel.create({
		companyName,
		email,
		phone,
		password: hashed,
	})
	assertCart()
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
export const getUser = catchAsyncError(async (req, res) => {
	try {
		// req.user is populated by your auth middleware
		const userId = req.params.user_id;
	
		const user = await userModel.findById(userId).select("-password"); // Exclude password for security
	
		if (!user) {
		  return res.status(404).json({ message: "User not found" });
		}
	
		res.status(200).json({ user });
	  } catch (error) {
		console.error("Get Profile Error:", error);
		res.status(500).json({ message: "Internal Server Error" });
	  }
})

export const updateUser = catchAsyncError(async (req, res) => {
	const { user_id } = req.params
	const user = await userModel.findOneAndUpdate(
		{ _id: user_id },
		req.body,
		{new:true}
	)
	res.status(201).json({ user })
})

export const deleteUser= catchAsyncError(async (req, res) => {
	const { user_id } = req.params
	const user = await userModel.findOneAndDelete({
		_id: user_id,
	})
	res.json({ user })
})

export const forgetPassword=catchAsyncError(async(req,res)=>{
	const{email}=req.body
	const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Email not found" });
    }
      console.log(process.env.FRONTEND_URL);
	  
	const email_token = jwt.sign({email},process.env.EMAIL_SECRET)
  const link=`https://aliaa18.github.io/mcistore/resetPass/${email_token}`
  await transporter.sendMail({
  from:process.env.EMAIL,
  to:email,
  subject:"forget Password",
  text:"change your password",
  html:`<a href=${link}>Click here to change your password</a>`
  })
		  res.json({message: "check your email" , email_token})   
  })


  export const resetPassword = catchAsyncError(async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;
  
	try {
	  const { email } = jwt.verify(token, process.env.EMAIL_SECRET);
  
	  const user = await userModel.findOne({ email });
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
  
	  const isSamePassword = await bcrypt.compare(newPassword, user.password);
	  if (isSamePassword) {
		return res.status(400).json({ message: "This is the same as the old password" });
	  }
  
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
	  user.password = hashedPassword;
	  await user.save();
  
	  res.status(200).json({ message: "Password updated successfully" });
	} catch (error) {
	  res.status(400).json({ message: error.message || "Invalid token or request" });
	}
  });
  