import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import categoryModel from '../models/category.model.js'

export const getCategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug }) .populate({
        path: 'subcategory',
        populate: {
          path: 'product', // Populate products inside each subcategory
          model: 'product'
        }
      })
      .populate('products');
	res.json({ category })
})

export const getCategories = catchAsyncError(async (req, res) => {
	const apiFeatures = new ApiFeatures(
		categoryModel.find().populate({
			path: 'subcategories',
			populate: {
			  path: 'products', // Populate products inside each subcategory
			  model: 'product'
			}
		  })
		  .populate('products'),
		req.query
	).paginate(10)
	const categories = await apiFeatures.query
	res.json({ categories })
})

export const addCategory = catchAsyncError(async (req, res) => {
	const category = await categoryModel.create(req.body)
	res.status(201).json({ category })
})

export const updateCategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOneAndUpdate(
		{ slug: categorySlug },
		req.body,
		{new:true}
	)
	res.status(201).json({ category })
})

export const deleteCategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOneAndDelete({
		slug: categorySlug,
	})
	res.json({ category })
})
