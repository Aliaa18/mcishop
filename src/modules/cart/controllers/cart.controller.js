import { AppError, catchAsyncError } from '../../../utils/error.handler.js'
import couponModel from '../../coupon/models/coupon.model.js'
import cartModel from '../models/cart.model.js'
import transporter from '../../../utils/email.js'
import dotenv from 'dotenv'
dotenv.config()
export const getCart = catchAsyncError(async (req, res) => {
	const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id')
    
	res.json({ cart , status:"success" })
})

export const addToCart = catchAsyncError(async (req, res) => {
	const { product_id } = req.body
	const cart = await cartModel.findOne({ user_id: req.user.id })
              
	const productEntry = cart.products.find(
		(entry) => entry.product_id._id.toString() === product_id
	)
              
			  
	if (!productEntry) cart.products.push({ product_id, quantity: 1 })
	else productEntry.quantity++

	await cart.save()

	res.json({cart, status:'Added successfully'})
})

export const removeFromCart = catchAsyncError(async (req, res) => {
	const { product_id } = req.body
	const cart = await cartModel.findOne({ user_id: req.user.id })
  
	const productEntry = cart.products.find(
		(entry) => entry.product_id._id.toString() === product_id
	)

	if (!productEntry) throw new AppError('Product not found', 404)

	 cart.products.remove(productEntry)

	await cart.save()

	res.json({ cart  , status:'Removed successfully'})
})


export const clearCart = async (req, res) => {
  try {
    //const userId = req.user.id; // Assuming the user ID is available from authentication middleware

    // Find the user's cart and clear the products array
    const cart = await cartModel.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: { products: [] } }, // Remove all items from the cart
      { new: true } // Return the updated cart
    );
      
		   
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json({
      message: 'Cart has been cleared successfully.',
      cart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      message: 'An error occurred while clearing the cart.',
      error: error.message,
    });
  }
};


export const updateCart = async (req, res) => {
  try {
    const { count, product_id } = req.body; // Ensure `count` and `product_id` are sent in the request body
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    // Validate inputs
    if (!count || !product_id) {
      return res.status(400).json({ message: 'Both count and product_id are required.' });
    }

    // Find the user's cart
    const cart = await cartModel.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.product_id._id.toString() === product_id
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    // Update the product's quantity
    cart.products[productIndex].quantity += count;

    // Ensure the quantity doesn't go below zero
    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1); // Remove the product if quantity is zero or less
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: 'Cart updated successfully.',
      cart,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      message: 'An error occurred while updating the cart.',
      error: error.message,
    });
  }
};



export const applyCoupon = catchAsyncError(async (req, res) => {
	const { code } = req.body
	const cart = await cartModel.findOne({ user_id: req.user.id })

	if (!code) {
		cart.coupon_id = null
		await cart.save()
		return res.json({ message: 'Coupon removed successfully' })
	}

	const coupon = await couponModel.findOne({
		code,
		expiry: { $gte: Date.now() },
	})

	if (!coupon) throw new AppError('Invalid Coupon', 400)

	cart.coupon_id = coupon._id
	await cart.save()
	res.json({ message: 'Coupon added successfully' })
})

export const checkOutMail = catchAsyncError(async (req, res) => {
	const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id')
      let arr_ele = []
      arr_ele = cart.products.map(( ele , i)=>( ele.product_id.title ))
	  transporter.sendMail({  
		 from:req.user.email,
		 to: process.env.EMAIL,
		 subject: 'Cart Checkout',
		 text: `customer  ${req.user.email} from ${cart.user_id.companyName} company want to make order with this products: { ${arr_ele} }`,
	})

	res.status(201).json({ message: 'The email sent to Mci-sales successfully, we will contact you soon!'  , arr_ele  })
})