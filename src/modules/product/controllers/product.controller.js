import { ApiFeatures } from '../../../utils/apiFeatures.js'
import transporter from '../../../utils/email.js'
import { AppError, catchAsyncError } from '../../../utils/error.handler.js'
import dotenv from 'dotenv'
import { makeImage } from '../../image/utils/image.utils.js'
import brandModel from '../models/brand.model.js'
import categoryModel from '../models/category.model.js'
import imageOnProductModel from '../models/imageOnProduct.js'
import productModel from '../models/product.model.js'
import subcategoryModel from '../models/subcategory.model.js'
dotenv.config()
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
	res.json({ product})
})

export const addProductWithImages = catchAsyncError(async (req, res, next) => {
      const user = req.user;
//         if (user.role === "ADMIN"){
// 			const subcategory= await subcategoryModel.findById(req.body.subcategory_id)
// 	// console.log( "noww" , subcategory);
// 	 if (!subcategory) {
// 		throw new Error('Subcategory not found');
// 	  }
// 	const categoryId = subcategory.category_id;
// 	// console.log(categoryId);

// 	const productData = { ...req.body, category_id: categoryId  }
        
// 	const product = await productModel.create(productData)
// 	subcategory.products.push(product._id);
//     await subcategory.save();
//    const category = await categoryModel.findById(categoryId);
//     category.products.push(product._id)
// 	await category.save()
// 	await brandModel.findByIdAndUpdate(req.body.brand_id, {
// 		$push: { products: product._id },
// 	  });
// 	if (req.files?.images)
// 		await Promise.all(
// 			req.files.images.map(async (file) => {
// 				try {
// 					const image = await makeImage(file.path)
// 					await imageOnProductModel.create({
// 						image_id: image._id,
// 						product_id: product._id,
// 					})
// 				} catch (error) {
// 					return next(error)
// 				}
// 			})
// 		)


// 	return res.status(201).json({
// 		message: `Added product with ${req.files.images?.length || 0} images`, user
// 	})
// 		}

    //  if (user.role === "SEMIADMIN"){
		

    // return res.status(200).json({
    //   success: true,
    //   message: "Request sent to admin for approval",
    // });
	//  } 



	 const subcategory= await subcategoryModel.findById(req.body.subcategory_id)
	// console.log( "noww" , subcategory);
	 if (!subcategory) {
		throw new Error('Subcategory not found');
	  }
	const categoryId = subcategory.category_id;
	// console.log(categoryId);

	const productData = { ...req.body, category_id: categoryId  }
        
	const product = await productModel.create(productData)
	subcategory.products.push(product._id);
    await subcategory.save();
   const category = await categoryModel.findById(categoryId);
    category.products.push(product._id)
	await category.save()
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
		message: `Added product with ${req.files.images?.length || 0} images`, user
	})
})

// controllers/productController.js
export const updateProductWithImages = catchAsyncError(async (req, res, next) => {
	const subcategory = await subcategoryModel.findById(req.body.subcategory_id);
	if (!subcategory) {
	  throw new Error('Subcategory not found');
	}
	const categoryId = subcategory.category_id;
  
	const product = await productModel.findOne({ slug: req.params.productSlug });
	if (!product) return next(new AppError('Product not found', 404));
  
	const productData = { ...req.body, category_id: categoryId };
  
	// ✅ IMAGE HANDLING
	if (req.files?.images && req.files.images.length > 0) {
	  // Delete old image references
	  await Promise.all(product.images.map(async (image) => {
		try {
		  await imageOnProductModel.findByIdAndDelete(image._id);
		} catch (error) {
		  return next(error);
		}
	  }));
  
	  // Upload new images
	  const newImageRefs = await Promise.all(req.files.images.map(async (file) => {
		try {
		  const image = await makeImage(file.path);
		  const imgDoc = await imageOnProductModel.create({
			image_id: image._id,
			product_id: product._id,
		  });
		  return imgDoc._id;
		} catch (error) {
		  return next(error);
		}
	  }));
  
	  productData.images = newImageRefs;
	} else {
	  // ✅ No new images → Preserve existing images
	  productData.images = product.images.map(img => img._id);
	}
  
	// Update product
	await productModel.updateOne({ slug: req.params.productSlug }, productData);
  
	// Update subcategory and category relationships
	if (!subcategory.products.includes(product._id)) {
	  subcategory.products.push(product._id);
	  await subcategory.save();
	}
  
	const category = await categoryModel.findById(categoryId);
	if (!category.products.includes(product._id)) {
	  category.products.push(product._id);
	  await category.save();
	}
  
	// Update brand products
	await brandModel.findByIdAndUpdate(req.body.brand_id, {
	  $addToSet: { products: product._id },
	});
  
	res.json({
	  message: `Product updated successfully with ${req.files?.images?.length || 0} new image(s).`,
	});
  });
  

export const deleteProduct = catchAsyncError(async (req, res, next) => {
	const product = await productModel.findOneAndDelete({
		slug: req.params.productSlug,
	})
	res.json({ product })
})
