import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import { makeImage } from '../../image/utils/image.utils.js'
import brandModel from '../models/brand.model.js'
import imageOnProductModel from '../models/imageOnProduct.js'
import productModel from '../models/product.model.js'

export const getProducts = catchAsyncError(async (req, res, next) => {
	const apiFeature = new ApiFeatures(productModel.find(), req.query)
		.paginate()
		.fields()
		.filter()
		.search(['title', 'description'])
		.sort()
	const products = await apiFeature.query
	res.json({ products })
})

export const getProduct = catchAsyncError(async (req, res, next) => {
	const product = await productModel.findOne({ slug: req.params.productSlug })
	res.json({ product })
})

export const addProductWithImages = catchAsyncError(async (req, res, next) => {
	const product = await productModel.create(req.body)
   await brandModel.findByIdAndUpdate(req.body.brand_id, {
		$push: { products: product._id },
	  });
	if (req.files?.images)
		await Promise.all(
			req.files.images.map(async (file) => {
				try {
					const image = await makeImage(file.path)
					await imageOnProductModel.create({
						image_id: image._id,
						product_id: product._id,
					})
				} catch (error) {
					return next(error)
				}
			})
		)
	res.status(201).json({
		message: `Added product with ${req.files.images?.length || 0} images`,
	})
})

export const updateProductWithImages = catchAsyncError(
	async (req, res, next) => {
		const product = await productModel.findOne({
			slug: req.params.productSlug,
		})
			console.log(product);
		if (req.files?.images) {
				
			await Promise.all(
				product.images.map(async (image) => {
					console.log("iam here" , image);
					
					try {
						await imageOnProductModel.findByIdAndDelete(image._id)
						
						
					} catch (error) {
						return next(error)
					}
				})
			)
			await Promise.all(
				req.files.images.map(async (file) => {
					try {
						const image = await makeImage(file.path)
						console.log("hello",image)
						await imageOnProductModel.create({
							image_id: image._id,
							product_id: product._id,
						})
						console.log("pro" , product.slug);
						
					} catch (error) {
						return next(error)
					}
				})
			)
		}
		
		await productModel.updateOne(
			{ slug: req.params.productSlug }, 
			req.body // Update data
		);
		
			
		res.json({
			message: `Updated product with ${
				req.files.images?.length || 0
			} images`,
		})
		
	}
)

export const deleteProduct = catchAsyncError(async (req, res, next) => {
	const product = await productModel.findOneAndDelete({
		slug: req.params.productSlug,
	})
	res.json({ product })
})
