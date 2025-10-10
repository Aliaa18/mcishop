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
	getCarts,
} from '../controllers/cart.controller.js'
import { assertCart } from '../middlewares/cart.middleware.js'

const router = Router()

router.route('/').get(authenticate, authorize(ROLES.USER), assertCart, getCart)
router.route('/all').get(authenticate, authorize(ROLES.ADMIN), assertCart, getCarts)
router.route('/checkout').get(authenticate, authorize(ROLES.USER) , checkOutMail)
router
	.route('/add')
	.put(authenticate, assertCart, addToCart)
router
	.route('/update')
	.put(authenticate, assertCart, updateCart)
router
	.route('/remove')
	.put(authenticate, assertCart, removeFromCart)
router
	.route('/coupon')
	.put(authenticate, assertCart, applyCoupon)
router
     .route('/clear')
	 .delete(authenticate, assertCart, clearCart)
export default router
