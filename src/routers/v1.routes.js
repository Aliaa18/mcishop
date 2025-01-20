import { Router } from 'express'
import productsRouter  from '../modules/product/routers/product.routes.js'
import categoriesRouter from '../modules/product/routers/category.routes.js'
import subcategoriesRouter from '../modules/product/routers/subcategory.routes.js'
// import couponsRouter from '../modules/coupon/routers/coupon.routes.js'
 import brandsRouter from '../modules/product/routers/brand.routes.js'
// import usersRouter from '../modules/user/routers/user.routes.js'
 import cartsRouter from '../modules/cart/routers/cart.routes.js'
 import authRouter from '../modules/auth/auth.routes.js'
 import ordersRouter from '../modules/cart/routers/orders.routes.js'
const router = Router()

router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)
 router.use('/brands', brandsRouter)
router.use('/subcategories', subcategoriesRouter)
 router.use('/cart', cartsRouter)
// router.use('/coupons', couponsRouter)
// router.use('/users', usersRouter)
router.use('/auth', authRouter)
router.use('/orders', ordersRouter)


export default router
