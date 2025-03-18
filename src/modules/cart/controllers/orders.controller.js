import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { AppError, catchAsyncError } from '../../../utils/error.handler.js'
import orderModel from '../models/order.model.js'
import cartModel from '../models/cart.model.js'
import productModel from '../../product/models/product.model.js'

export const getUserOrders = catchAsyncError(async (req, res) => {
    // const apiFeatures=new ApiFeatures(
    //     orderModel.find({user_id : req.user.id})
    // ).paginate(10)
     const user_id = req.params.user_id
	const orders = await  orderModel.find({user_id}).populate('products.product_id')
	res.json({ orders })
    
})
export const getUsersOrders = catchAsyncError(async (req, res) => {
    const apiFeatures=new ApiFeatures(
        orderModel.find()
    )
	const orders = await  apiFeatures.query
	res.json({ orders })
    
})
export const updateOrder = catchAsyncError(async (req , res )=>{
     
    try {
        const { userId, orderId } = req.params;
        const { status, isPaid, total_price } = req.body;
    
        // Create a safe update object (prevent unwanted fields like _id/user_id update)
        const updateFields = {};
        if (status !== undefined) updateFields.status = status;
        if (isPaid !== undefined) updateFields.isPaid = isPaid;
        if (total_price !== undefined) updateFields.total_price = total_price;
    
        const updatedOrder = await orderModel.findOneAndUpdate(
          { _id: orderId, user_id: userId },
          updateFields,
          { new: true }
        );
    
        if (!updatedOrder) {
          return res.status(404).json({ success: false, message: "Order not found or doesn't belong to the user." });
        }
    
        return res.status(200).json({ success: true, order: updatedOrder });
      } catch (error) {
        console.error("Update Order Error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
      }

})

// export const makeCODorder = catchAsyncError(async(req,res)=>{
//        // 1-cart
//        const cart = await cartModel.findOne({user_id:req.user.id}) 
//         cart.products.forEach((product)=>{
//         if(product.product_id.stock < product.quantity)
//             throw new AppError("insufficient stock" , 400)
//         })
//        // 2-products

//        const orderProducts = await orderModel.create({
//         user_id:req.user.id,
//         coupon:{
//             discount:cart.coupon_id?.discount||0
//         },
//         products: cart.products.map(
//             ({product_id:{title , price , discounted_price} , quantity})=>({
//                  quantity,
//                  product:{
//             title,
//             price,
//             discounted_price
//             }
//              })
//         ),
//          ...req.body,

//        })

//        if (!orderProducts) throw new AppError('Order Failed' , 400)
//         const  bulckWriteOptions= cart.products.map(({product_id:{_id} , quantity})=>({
//             updateOne :{
//                 filter :{_id},
//                 update:{
//                    $inc: {
//                        stock:-quantity
//                    }
//                 }
//            }
//         }))
//         await productModel.bulkWrite(bulckWriteOptions)
       
//         res.json({orderProducts})
//     })

//  export const makePaymentSession = catchAsyncError(async(req , res)=>{

//  })   


