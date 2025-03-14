import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		companyName: {
			type: String,
			trim: true,
			minLength: 3,
			maxLength: 500,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone:{
       type:String,
	   required:true
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		role: {
			type: String,
			enum: ['USER', 'ADMIN'],
			default: 'USER',
		},
        email_verified:{
              type: Boolean,
              default:false,
        },
		blocked: {
			type: Boolean,
			default: false,
		},
		// wishlist: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: 'product',
		// 	},
		// ],
	},
	{ timestamps: true }
)



const userModel = mongoose.model('user', userSchema)

export default userModel