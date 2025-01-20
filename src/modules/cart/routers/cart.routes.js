import { Router } from 'express'
import { authenticate, authorize } from '../../auth/auth.middlewares.js'
import { ROLES } from '../../../utils/enums.js'
import {
	addToCart,
	getCart,
	removeFromCart,
	applyCoupon,
	clearCart,
	updateCart,
	checkOutMail,
} from '../controllers/cart.controller.js'
import { assertCart } from '../middlewares/cart.middleware.js'

const router = Router()

router.route('/').get(authenticate, authorize(ROLES.USER), assertCart, getCart)
router.route('/checkout').get(authenticate, authorize(ROLES.USER), assertCart, checkOutMail)
router
	.route('/add')
	.put(authenticate, authorize(ROLES.USER), assertCart, addToCart)
router
	.route('/update')
	.put(authenticate, authorize(ROLES.USER), assertCart, updateCart)
router
	.route('/remove')
	.put(authenticate, authorize(ROLES.USER), assertCart, removeFromCart)
router
	.route('/coupon')
	.put(authenticate, authorize(ROLES.USER), assertCart, applyCoupon)
router
     .route('/clear')
	 .delete(authenticate, authorize(ROLES.USER), assertCart, clearCart)
export default router
