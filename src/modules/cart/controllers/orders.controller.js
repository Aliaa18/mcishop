import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { AppError, catchAsyncError } from '../../../utils/error.handler.js'
import orderModel from '../models/order.model.js'
import cartModel from '../models/cart.model.js'
import productModel from '../../product/models/product.model.js'

export const getUserOrders = catchAsyncError(async (req, res) => {
    const apiFeatures=new ApiFeatures(
        orderModel.find({user_id : req.user.id})
    ).paginate(10)
	const orders = await  apiFeatures.query
	res.json({ orders })
    
})
export const getUsersOrders = catchAsyncError(async (req, res) => {
    const apiFeatures=new ApiFeatures(
        orderModel.find()
    )
	const orders = await  apiFeatures.query
	res.json({ orders })
    
})


export const makeCODorder = catchAsyncError(async(req,res)=>{
       // 1-cart
       const cart = await cartModel.findOne({user_id:req.user.id}) 
        cart.products.forEach((product)=>{
        if(product.product_id.stock < product.quantity)
            throw new AppError("insufficient stock" , 400)
        })
       // 2-products

       const orderProducts = await orderModel.create({
        user_id:req.user.id,
        coupon:{
            discount:cart.coupon_id?.discount||0
        },
        products: cart.products.map(
            ({product_id:{title , price , discounted_price} , quantity})=>({
                 quantity,
                 product:{
            title,
            price,
            discounted_price
            }
             })
        ),
         ...req.body,

       })

       if (!orderProducts) throw new AppError('Order Failed' , 400)
        const  bulckWriteOptions= cart.products.map(({product_id:{_id} , quantity})=>({
            updateOne :{
                filter :{_id},
                update:{
                   $inc: {
                       stock:-quantity
                   }
                }
           }
        }))
        await productModel.bulkWrite(bulckWriteOptions)
       
        res.json({orderProducts})
    })

 export const makePaymentSession = catchAsyncError(async(req , res)=>{

 })   


