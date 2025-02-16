import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema(
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
		products:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'product',
		}]
	},
	{ timestamps: true }
)

categorySchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true })
	next()
})

categorySchema.pre(/update/i, function (next) {
	if (this._update.name)
		this._update.slug = slugify(this._update.name, { lower: true })
	next()
})



categorySchema.pre(/delete/i, async function (next) {
	const toBeDeletedCategory = await categoryModel.findOne(this._conditions)
	if (!toBeDeletedCategory) return next()
	await mongoose.model('product').findByIdAndDelete(toBeDeletedCategory.products)
	next()
})

categorySchema.pre(/update/i, async function (next) {
	if (!this._update.image) return next()
	const toBeUpdated = await categoryModel.findOne(this._conditions)
	if (!toBeUpdated) return next()
	await mongoose.model('product').findByIdAndDelete(toBeUpdated.products)
	next()
})

const categoryModel = mongoose.model('category', categorySchema)

export default categoryModel
