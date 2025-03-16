import Joi from 'joi'

export const getProductSchema = Joi.object({
	body: {},
	params: { productSlug: Joi.string().required() },
	query: {},
})

export const addProductSchema = Joi.object({
	body: {
		title: Joi.string().min(3).max(1000).trim().required(),
		description: Joi.string().min(3).max(10000).trim().required(),
		stock: Joi.number().min(0).required(),
		price: Joi.number().min(0.01).required(),
		discounted_price: Joi.number().min(0.01),
		features: Joi.string().min(3).max(10000).trim(),
		apps: Joi.string().trim(),
		subcategory_id: Joi.string().hex().length(24),
		category_id: Joi.string().hex().length(24),
		brand_id:Joi.string().hex().length(24)
	},
	params: {},
	query: {},
	files: Joi.object().required(),
})

export const updateProductSchema = Joi.object({
	body: {
		title: Joi.string().min(3).max(1000).trim(),
		description: Joi.string().min(3).max(10000).trim(),
		stock: Joi.number().min(0),
		price: Joi.number().min(0.01),
		discounted_price: Joi.number().min(0.01),
		features: Joi.string().min(3).max(10000).trim(),
		apps: Joi.string().trim(),
		subcategory_id: Joi.string().hex().length(24),
		category_id: Joi.string().hex().length(24),
		brand_id: Joi.string().hex().length(24),
	},
	params: { productSlug: Joi.string().required() },
	query: {},
	files: Joi.object(),
})

export const deleteProductSchema = Joi.object({
	body: {},
	params: { productSlug: Joi.string().required() },
	query: {},
})
