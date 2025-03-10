import { Router } from 'express'
import { deleteUser, forgetPassword, getUsers, resetPassword, signin, signup, updateUser, validateEmail } from './auth.controller.js'
import { assertUniqueEmail, authenticate, authorize } from './auth.middlewares.js'
import { validate } from '../../middlewares/validation.middleware.js'
import {
	deleteUserSchema,
	forgetPasswordSchema,
	resetPasswordSchema,
	signinSchema,
	signupSchema,
	updateUserSchema,
	validateEmailSchema,
} from './auth.validate.js'
import { assertCart } from '../cart/middlewares/cart.middleware.js'

const router = Router()
router.get('/', getUsers)
router.post('/signin', validate(signinSchema) ,signin)
router.post('/signup', validate(signupSchema), assertUniqueEmail, signup)
router.post('/forgetPassword/',validate(forgetPasswordSchema),forgetPassword)
router.post('/resetPassword/:token', validate(resetPasswordSchema), resetPassword);

router.get('/validate/:token', validate(validateEmailSchema), validateEmail)
router
	.route('/:user_id')
	// .get(getUser)
	.put(
		validate(updateUserSchema),
		updateUser
	)
	.delete(validate(deleteUserSchema), deleteUser)
	//router.get('/profile/' , authenticate , getUser)
export default router
