import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import categoryModel from '../models/category.model.js'

export const getCategory = catchAsyncError(async (req, res) => {
	const { categorySlug } = req.params
	const category = await categoryModel.findOne({ slug: categorySlug }) .populate({
        path: 'subcategories',
        populate: {
          path: 'products', // Populate products inside each subcategory
          model: 'product'
        }
      })
      .populate('products');
	res.json({ category })
})

export const getCategories = catchAsyncError(async (req, res) => {
	try {
		const apiFeatures = new ApiFeatures(
		  categoryModel.find()
			.populate({
			  path: "subcategories",
			  populate: {
				path: "products", // Populate products inside each subcategory
				model: "product",
			  },
			})
			.populate("products"),
		  req.query
		);
	
		//await apiFeatures.paginate(); // Ensure pagination applies before querying
	
		const categories = await apiFeatures.query;
	
		res.status(200).json({ success: true, categories });
	  } catch (error) {
		console.error("Error fetching categories:", error.message);
		res.status(500).json({ success: false, message: error.message });
	  }
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
