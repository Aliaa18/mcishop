import imageModel from "../../image/models/image.model.js";
import { makeImage } from "../../image/utils/image.utils.js";
import imageOnProductModel from "../models/imageOnProduct.js";
import pendingProductModel from "../models/pendingProduct.model.js";
import productModel from "../models/product.model.js";
import product from "../models/product.model.js";

// ✅ اعتماد المنتج (Approve)
export const approveProduct = async (req, res) => {
  try {
    const { pendingProductId } = req.params;
    console.log('🟡 pendingProductId:', pendingProductId);

    const pendingProduct = await pendingProductModel.findById(pendingProductId);
    if (!pendingProduct) {
      console.log('❌ pendingProduct not found');
      return res.status(404).json({ message: 'Pending product not found' });
    }

    console.log('✅ Found pendingProduct:', pendingProduct.title);

    // ✅ Check if coverImagePath موجود
    if (!pendingProduct.coverImagePath) {
      console.log('⚠️ No coverImagePath found!');
      return res.status(400).json({ message: 'Missing coverImagePath' });
    }

    // 🧩 إنشاء صورة الكوفر
    const coverImage = await makeImage(pendingProduct.coverImagePath);
    console.log('✅ Created coverImage:', coverImage);

    // 🧩 إنشاء المنتج في الكولكشن الرئيسي
    const product = await productModel.create({
      title: pendingProduct.title,
      price: pendingProduct.price,
      stock: pendingProduct.stock,
      description: pendingProduct.description,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      category_id: pendingProduct.category_id,
      apps: pendingProduct.apps,
      cover_image: coverImage._id,
    });

    console.log('✅ Product created:', product._id);

    // 🖼️ إضافة باقي الصور
    if (pendingProduct.imagePaths?.length) {
      for (const path of pendingProduct.imagePaths) {
        const image = await makeImage(path);
        await imageOnProductModel.create({
          image_id: image._id,
          product_id: product._id,
        });
      }
    }

    await pendingProductModel.findByIdAndDelete(pendingProductId);
    console.log('🗑️ Pending product deleted');

    res.status(201).json({
      message: 'Product approved and moved successfully',
      product,
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
