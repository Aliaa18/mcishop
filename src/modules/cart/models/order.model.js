import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		products: [
			{
				product_id: {
									type: mongoose.Schema.Types.ObjectId,
									ref: 'product',
									required: true,
								},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		coupon:{
			discount:Number
		},
		payment_type:{
			type:String,
			enum:["COD" , "CARD"],
			default:"COD"
		},
		status: {
			type: String,
			enum: ['OPEN', 'CLOSE' , 'PAID'],
			default: 'OPEN',
		},
		is_dlivered:{
			type:Boolean,
			default:false
		},
		total_price:{
			type:Number,
			
		}

	 },
	{ timestamps: true,
		toJSON:{virtuals:true},
		toObject:{virtuals:true}
	 }
)

// orderSchema.virtual('total_price').get(function () {
// 	const total = this.products.reduce(
// 		(acc, entry) =>
// 			acc + entry.product.price * entry.quantity,
// 		0
// 	)
// 	return total 
// })

// orderSchema.virtual('total_discounted_price').get(function () {
// 	const total = this.products.reduce(
// 		(acc, entry) =>
// 			acc + entry.product.discounted_price * entry.quantity,
// 		0
// 	)
// 	return total - ((this.coupon?.discount || 0) / 100) * total
// })

const orderModel = mongoose.model('order', orderSchema)

export default orderModel
