import mongoose from 'mongoose'

const productOnCartSchema = new mongoose.Schema(
	{
		product_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'product',
			required: true,
		},
		cart_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'cart',
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
	},
	{ timestamps: true }
)

const productOnCartModel = mongoose.model('productOnCart', productOnCartSchema)

export default productOnCartModel
