import mongoose from 'mongoose'
import slugify from 'slugify'

const subcategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minLength: 3,
			maxLength: 200,
			required: true,
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			minLength: 3,
			maxLength: 200,
			trim: true,
			unique: true,
		},
		category_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'category',
			required: true,
		},
		products:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'product',
		}]
	},
	{ timestamps: true }
)

subcategorySchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true })
	next()
})
subcategorySchema.pre(/find/, function (next) {
	this.populate('product')
	next()
})

subcategorySchema.pre(/update/i, function (next) {
	if (this._update.name)
		this._update.slug = slugify(this._update.name, { lower: true })
	next()
})
subcategorySchema.pre(/delete/i, async function (next) {
	const toBeDeleted = await subcategoryModel.findOne(this._conditions)
	if (!toBeDeleted) return next()
	await mongoose.model('product').findByIdAndDelete(toBeDeleted.products)
	next()
})

subcategorySchema.pre(/update/i, async function (next) {
	if (!this._update.logo) return next()
	const toBeUpdated = await subcategoryModel.findOne(this._conditions)
	if (!toBeUpdated) return next()
	await mongoose.model('product').findByIdAndDelete(toBeUpdated.products)
	next()
})

const subcategoryModel = mongoose.model('subcategory', subcategorySchema)

export default subcategoryModel
