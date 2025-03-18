import { Router } from 'express'
import { authenticate, authorize } from '../../auth/auth.middlewares.js'
import { ROLES } from '../../../utils/enums.js'
import { assertCart } from '../middlewares/cart.middleware.js'
import { getUserOrders , getUsersOrders } from '../controllers/orders.controller.js'
import { validate } from '../../../middlewares/validation.middleware.js'
import { addOrderSchema } from '../validation/orders.validation.js'
const router = Router()

router.route('/:user_id').get(getUserOrders)
router.route('/all').get(authenticate, authorize(ROLES.ADMIN), getUsersOrders)

// router
//     .route('/cash')
//     .post(authenticate, authorize(ROLES.USER),validate(addOrderSchema) ,assertCart, makeCODorder)

// router
//     .route('/card')
//     .put(authenticate, authorize(ROLES.USER), assertCart, onlineSession)


export default router