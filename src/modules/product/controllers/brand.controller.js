import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import brandModel from '../models/brand.model.js'

export const getBrand = catchAsyncError(async (req, res) => {
	const { brandSlug } = req.params
	const brand = await brandModel.findOne({ slug: brandSlug }).populate('products')
	res.json({ brand })
})

export const getBrands = catchAsyncError(async (req, res) => {
	const apiFeatures = new ApiFeatures(brandModel.find().populate('products'), req.query).paginate().fields()
	.filter()
	const brands = await apiFeatures.query
	res.json({ brands })
})

export const addBrand = catchAsyncError(async (req, res) => {
	const brand = await brandModel.create(req.body)
	res.status(201).json({ brand })
})

export const updateBrand = catchAsyncError(async (req, res) => {
	const { brandSlug } = req.params
	const brand = await brandModel.findOneAndUpdate(
		{ slug: brandSlug },
		req.body,
		{ new: true }
	)
	res.json({ brand })
})

export const deleteBrand = catchAsyncError(async (req, res) => {
	const { brandSlug } = req.params
	const brand = await brandModel.findOneAndDelete({ slug: brandSlug } ,{new:true})
	res.json({ brand })
})
