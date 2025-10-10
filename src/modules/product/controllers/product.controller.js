import { ApiFeatures } from "../../../utils/apiFeatures.js";
import transporter from "../../../utils/email.js";
import { AppError, catchAsyncError } from "../../../utils/error.handler.js";
import dotenv from "dotenv";
import { makeImage } from "../../image/utils/image.utils.js";
import brandModel from "../models/brand.model.js";
import categoryModel from "../models/category.model.js";
import imageOnProductModel from "../models/imageOnProduct.js";
import productModel from "../models/product.model.js";
import subcategoryModel from "../models/subcategory.model.js";
import  pendingProductModel  from "../models/pendingProduct.model.js";
dotenv.config();
export const getProducts = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search(["title", "description"])
    .sort();
  const products = await apiFeature.query;
  res.json({ products });
});

export const getProduct = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findOne({ slug: req.params.productSlug });
  res.json({ product });
});
// export const rejectProduct = catchAsyncError(async (req, res, next) => {
//   try {
//     const { token } = req.query;
//     if (!token) return res.status(400).send("Invalid request");

//     jwt.verify(token, process.env.SECRET); // بس نتحقق من صحته
//     res.send("<h2>❌ Product Rejected and not added</h2>");
//   } catch (err) {
//     res.status(400).send("Reject failed: " + err.message);
//   }
//  })
export const addProductWithImages = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  if (user.role?.toUpperCase() === "ADMIN") {
    const subcategory = await subcategoryModel.findById(
      req.body.subcategory_id
    );
    if (!subcategory) {
      throw new Error("Subcategory not found");
    }
    const categoryId = subcategory.category_id;

    const productData = { ...req.body, category_id: categoryId };
        console.log(productData);
		
    const product = await productModel.create(productData);
    subcategory.products.push(product._id);
    await subcategory.save();
    const category = await categoryModel.findById(categoryId);
    category.products.push(product._id);
    await category.save();
    await brandModel.findByIdAndUpdate(req.body.brand_id, {
      $push: { products: product._id },
    });
    if (req.files?.images)
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path);
            await imageOnProductModel.create({
              image_id: image._id,
              product_id: product._id,
            });
          } catch (error) {
            return next(error);
          }
        })
      );

    return res.status(201).json({
      message: `Added product with ${
        req.files.images?.length || 0
      } images successfully`,
      user,
    });
  }
  const brand = await brandModel.findById(req.body.brand_id);
  const subcategory = await subcategoryModel.findById(req.body.subcategory_id);
  if (user.role?.toUpperCase() === "SEMIADMIN") {
    const coverImagePath = req.files?.cover_image?.[0]?.path || "";
    const imagePaths = req.files?.images?.map((file) => file.path) || [];

    const pendingData = {
      ...req.body,
      coverImagePath,
      imagePaths,
      createdBy: user._id,
    };
    
    const pendingProduct = await pendingProductModel.create(pendingData);

const approveUrl = `https://mcishop.vercel.app/api/v1/products/approve/${pendingProduct._id}`;
const rejectUrl = `https://mcishop.vercel.app/api/v1/products/reject/${pendingProduct._id}`;


    let attachments = [];
    let imagesHtml = "";

    if (req.files?.cover_image?.[0]) {
      attachments.push({
        filename: req.files.cover_image[0].originalname,
        path: req.files.cover_image[0].path,
        cid: "coverImage", // لازم يبقى ثابت عشان نستدعيه في الـ HTML
      });

      imagesHtml += `
      <h3>Cover Image:</h3>
      <img src="cid:coverImage" width="250" style="margin:5px;" />
    `;
    }

    // ✅ باقي الصور
    if (req.files?.images) {
      attachments.push(
        ...req.files.images.map((file, index) => ({
          filename: file.originalname,
          path: file.path,
          cid: `productImage${index}`,
        }))
      );

      imagesHtml += `
      <h3>Product Images:</h3>
      ${req.files.images
        .map(
          (file, index) =>
            `<img src="cid:productImage${index}" width="200" style="margin:5px;" />`
        )
        .join("")}
    `;
    }

    const msg = {
      to: "aliaasultan75@gmail.com", // 📥 Your internal email (sales, admin, etc.)
      from: process.env.EMAIL, // 📤 Sender (same if you're using one verified domain/email)
      subject: "New Product Request",
      text: `A new .`,
      html: `
			<h2>New Product Request</h2>
    <p>User <strong>${user.email}</strong> requested to add a product.</p>
    <h3>Product Details:</h3>
    <ul>
      <li><strong>Title: </strong> ${req.body.title}</li>
      <li><strong>Price: </strong> ${req.body.price}</li>
      <li><strong>Stock: </strong> ${req.body.stock || ""}</li>
      <li><strong>Brand: </strong> ${brand ? brand.name : "unknown"}</li>
      <li><strong>Subcategory: </strong> ${
        subcategory ? subcategory.name : "unknown"
      }</li>
      <li><strong>Description: </strong> ${req.body.description || ""}</li>
      <li><strong>Applications: </strong> ${req.body.apps || ""}</li>
      <li><strong>Features: </strong> ${req.body.features || ""}</li>
    </ul>

			
        ${imagesHtml || "<p>No images provided</p>"}


		<br/><br/>
<a href="${approveUrl}" 
   style="background:green;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Approve</a>
<a href="${rejectUrl}" 
   style="background:red;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Reject</a>

		`,
      attachments,
    };
    try {
      let info = await transporter.sendMail(msg);
      console.log("Message sent: %s", info.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }
    return res.status(200).json({
      message: "The Request sended to the admin ",
    });
  }
  return res.status(201).json({
    message: `none`,
  });
});

// controllers/productController.js
export const updateProductWithImages = catchAsyncError(
  async (req, res, next) => {
    const subcategory = await subcategoryModel.findById(
      req.body.subcategory_id
    );
    if (!subcategory) {
      throw new Error("Subcategory not found");
    }
    const categoryId = subcategory.category_id;

    const product = await productModel.findOne({
      slug: req.params.productSlug,
    });
    if (!product) return next(new AppError("Product not found", 404));

    const productData = { ...req.body, category_id: categoryId };

    // ✅ IMAGE HANDLING
    if (req.files?.images && req.files.images.length > 0) {
      // Delete old image references
      await Promise.all(
        product.images.map(async (image) => {
          try {
            await imageOnProductModel.findByIdAndDelete(image._id);
          } catch (error) {
            return next(error);
          }
        })
      );

      // Upload new images
      const newImageRefs = await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path);
            const imgDoc = await imageOnProductModel.create({
              image_id: image._id,
              product_id: product._id,
            });
            return imgDoc._id;
          } catch (error) {
            return next(error);
          }
        })
      );

      productData.images = newImageRefs;
    } else {
      // ✅ No new images → Preserve existing images
      productData.images = product.images.map((img) => img._id);
    }

    // Update product
    await productModel.updateOne({ slug: req.params.productSlug }, productData);

    // Update subcategory and category relationships
    if (!subcategory.products.includes(product._id)) {
      subcategory.products.push(product._id);
      await subcategory.save();
    }

    const category = await categoryModel.findById(categoryId);
    if (!category.products.includes(product._id)) {
      category.products.push(product._id);
      await category.save();
    }

    // Update brand products
    await brandModel.findByIdAndUpdate(req.body.brand_id, {
      $addToSet: { products: product._id },
    });

    res.json({
      message: `Product updated successfully with ${
        req.files?.images?.length || 0
      } new image(s).`,
    });
  }
);

export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findOneAndDelete({
    slug: req.params.productSlug,
  });
  res.json({ product });
});
