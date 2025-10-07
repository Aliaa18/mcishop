import imageModel from "../../image/models/image.model.js";
import { makeImage } from "../../image/utils/image.utils.js";
import imageOnProductModel from "../models/imageOnProduct.js";
import pendingProductModel from "../models/pendingProduct.model.js";
import productModel from "../models/product.model.js";
import product from "../models/product.model.js";

// ✅ اعتماد المنتج (Approve)


export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingProduct = await pendingProductModel.findById(id);

    if (!pendingProduct) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    // ✅ Upload cover image to Cloudinary
    let coverImageDoc = null;
    if (pendingProduct.coverImagePath) {
      coverImageDoc = await makeImage(pendingProduct.coverImagePath);
    }

    // ✅ Create new product in products collection
    const newProduct = await productModel.create({
      title: pendingProduct.title,
      price: pendingProduct.price,
      stock: pendingProduct.stock,
      apps: pendingProduct.apps,
      features: pendingProduct.features,
      description: pendingProduct.description,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      cover_image: coverImageDoc?._id || null,
    });

    // ✅ Upload other product images to Cloudinary and link them
    if (pendingProduct.imagePaths && pendingProduct.imagePaths.length > 0) {
      await Promise.all(
        pendingProduct.imagePaths.map(async (imgPath) => {
          const img = await makeImage(imgPath);

          await imageOnProductModel.create({
            image_id: img._id,
            product_id: newProduct._id,
          });
        })
      );
    }

    // ✅ Delete pending product
    await pendingProductModel.findByIdAndDelete(id);

    // ✅ Populate cover image before sending to frontend
    const populatedProduct = await productModel
      .findById(newProduct._id)
      .populate("cover_image");

    res.status(200).json({
      message: "✅ Product approved successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("❌ Approve product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ❌ رفض المنتج (Reject)
export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductPending.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    res.status(200).json({ message: "Product rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
