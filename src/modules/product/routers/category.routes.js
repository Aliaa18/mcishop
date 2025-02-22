import { Router } from 'express'
import { validate } from '../../../middlewares/validation.middleware.js'
import {
	addCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
	getProductsByCategory
} from '../controllers/category.controller.js'
import {
	addCategorySchema,
	deleteCategorySchema,
	getCategorySchema,
	updateCategorySchema,
	getProductsByCategorySchema
} from '../validations/category.validations.js'
import subcategoryRouter from './subcategory.routes.js'

const router = Router()

router
	.route('/')
	.get(getCategories)
	.post(

		validate(addCategorySchema),
	
		addCategory
	)

router
	.route('/:categorySlug')
	.get(validate(getCategorySchema), getCategory)
	.put(
		
		validate(updateCategorySchema),
		
		updateCategory
	)
	.delete(validate(deleteCategorySchema), deleteCategory)
router.route('/:categorySlug/products').get( getCategory )
router.use('/:categorySlug/subcategories', subcategoryRouter)
router.use('/:categorySlug/subcategories/:subcategorySlug', subcategoryRouter)

export default router
