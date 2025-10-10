import { AppError, catchAsyncError } from '../../../utils/error.handler.js'
import couponModel from '../../coupon/models/coupon.model.js'
import cartModel from '../models/cart.model.js'
import transporter from '../../../utils/email.js'
import dotenv from 'dotenv'
import orderModel from '../models/order.model.js'
import sgMail from '@sendgrid/mail'
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
export const getCart = catchAsyncError(async (req, res) => {
  console.log( "get Cart" , req.user.id);
	const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id')
  res.status(200).json({ status: "success" , cart });
})
export const getCarts = catchAsyncError(async (req, res) => {
	const carts = await cartModel.find().populate('user_id')
    
	res.json({ carts , status:"success" })
})

export const addToCart = catchAsyncError(async (req, res) => {
	const { product_id } = req.body
  console.log(req.user.id);
  
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
  const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
     console.log(cart);
     
  const arr_ele = cart.products.map((ele) => ele.product_id.title);
  // const total = cart.total_price;
  console.log(process.env.SENDGRID_API_KEY.startsWith('SG')); // Should print true

  // Compose the message
  const msg = {
    to: "aliaasultan75@gmail.com", // 📥 Your internal email (sales, admin, etc.)
    from: process.env.EMAIL, // 📤 Sender (same if you're using one verified domain/email)
    subject: 'Cart Checkout Request',
    text: `Customer ${req.user.email} from "${cart.user_id.companyName}" company wants to make an order with these products: ${arr_ele.join(', ')}`,
    html: `
  <div style="font-family: Arial, sans-serif; padding: 10px;">
    <h2 style="color: #198754;">🛒 Cart Checkout</h2>
    <p>Customer <strong>${req.user.email}</strong> from <strong>${cart.user_id.companyName}</strong> company wants to make an order.</p>
    <p><strong>Products:</strong></p>
    <ul>
      ${arr_ele.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:3002/mci-dashboard#/userOrders/${cart.user_id._id}" style="
        display: inline-block;
        padding: 10px 25px;
        border: 2px solid #198754;
        border-radius: 30px;
        color: #198754;
        font-weight: 600;
        text-decoration: none;
        transition: background-color 0.3s ease, color 0.3s ease;
      " onmouseover="this.style.backgroundColor='#198754'; this.style.color='#fff';" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#198754';">
        Go to the Order
      </a>
    </div>
  </div>
`

  };

  try {
    let info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }

  // Create order
  const order = await orderModel.create({
    user_id: req.user.id,
    products: cart.products.map((p) => ({
      product_id: p.product_id,
      quantity: p.quantity
    })),
    // total_price: total
  });

  res.status(201).json({
    message: 'The email was sent to MCI sales successfully, we will contact you soon!',
    order,
    arr_ele
  });
});
// export const checkOutMail = catchAsyncError(async (req, res) => {
//   try {
//     const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id');
//     if (!cart) {
//       throw new Error("Cart not found for the user.");
//     }

//     const cartPro = cart.products;
//     const total = cart.total_price;
//     const arr_ele = cartPro.map((ele) => ele.product_id.title);

//     console.log("🟢 Sending from:", process.env.EMAIL);
//     console.log("🟢 Customer email:", req.user.email);
//     console.log("EMAIL ENV:", process.env.EMAIL);
// console.log("EMAIL_PASS ENV:", process.env.EMAIL_PASS);
// console.log("SMTP_HOST ENV:", process.env.SMTP_HOST);

// const msg = {
//   to: process.env.EMAIL, // receiver email
//   from: process.env.EMAIL, // verified sender email
//   subject: 'Cart Checkout',
//   text: `Customer ${req.user.email} from "${cart.user_id.companyName}" company wants to order: ${arr_ele.join(', ')}`,
// };

//     const order = await orderModel.create({
//       user_id: req.user.id,
//       products: cartPro.map((p) => ({
//         product_id: p.product_id,
//         quantity: p.quantity,
//       })),
//       total_price: total,
//     });
   
//     return res.status(201).json({
//       message: '✅ Email sent to Mci-sales successfully. We will contact you soon!',
//       arr_ele,
//       order,
//     });

//   } catch (error) {
//     console.error('❌ Checkout failed:', error.message);
//     return res.status(500).json({
//       message: '❌ Something went wrong during checkout',
//       error: error.message,
//     });
//   }
// });

// export const checkOutMail = catchAsyncError(async (req, res) => {
// 	const cart = await cartModel.findOne({ user_id: req.user.id }).populate('user_id')
//       console.log( "user nooo", req.user.email , process.env.EMAIL );
//      let cartPro = cart.products 
//      let total = cart.total_price 
//   let arr_ele = []
//       arr_ele = cart.products.map(( ele , i)=>( ele.product_id.title ))
//       try {
//         await transporter.sendMail({  
//           from: process.env.EMAIL ,
//            to: process.env.EMAIL,
//           subject: 'Cart Checkout',
//           text: `Customer ${req.user.email} from "${cart.user_id.companyName}" company wants to make an order with these products: { ${arr_ele.join(', ')} }`,
//         });
//       } catch (error) {
//         console.error('❌ Error sending email:', error);
//         // You can choose to continue anyway or throw an error
//         // return res.status(500).json({ message: 'Email sending failed', error });
//       }
      
//     const test = req.user.email
//     const order = await orderModel.create({user_id : req.user.id ,  products: cart.products.map((p) => ({
//       product_id: p.product_id, // IMPORTANT
//       quantity: p.quantity
//     })) , total_price :total})  
// 	res.status(201).json({ test ,message: 'The email sent to Mci-sales successfully , we will contact you soon!'  , arr_ele , order  })
// })