import imageModel from "../../image/models/image.model.js";
import { makeImage } from "../../image/utils/image.utils.js";
import imageOnProductModel from "../models/imageOnProduct.js";
import pendingProductModel from "../models/pendingProduct.model.js";
import productModel from "../models/product.model.js";
import product from "../models/product.model.js";
import subcategoryModel from "../models/subcategory.model.js";

// ✅ اعتماد المنتج (Approve)


export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const pendingProduct = await pendingProductModel.findById(id);
    if (!pendingProduct) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    // ✅ جلب الـ category_id من الـ subcategory
    const subcategory = await subcategoryModel.findById(pendingProduct.subcategory_id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const categoryId = subcategory.category_id;

    // ✅ إنشاء سجل لصورة الكوفر في imageModel (من الـ URL الجاهز)
    let coverImageDoc = null;
    if (pendingProduct.coverImagePath) {
      coverImageDoc = await imageModel.create({
        name: `cover_${pendingProduct.title}`,
        path: pendingProduct.coverImagePath,
      });
    }

    // ✅ إنشاء المنتج في قاعدة البيانات
    const newProduct = await productModel.create({
      title: pendingProduct.title,
      price: pendingProduct.price,
      description: pendingProduct.description,
      stock: pendingProduct.stock,
      apps: pendingProduct.apps,
      features: pendingProduct.features,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      category_id: categoryId,
      cover_image: coverImageDoc?._id || null,
    });

    // ✅ حفظ باقي الصور (gallery)
    if (pendingProduct.imagePaths?.length) {
      await Promise.all(
        pendingProduct.imagePaths.map(async (imgUrl) => {
          const img = await imageModel.create({
            name: `product_${pendingProduct.title}`,
            path: imgUrl,
          });

          await imageOnProductModel.create({
            image_id: img._id,
            product_id: newProduct._id,
          });
        })
      );
    }

    // ✅ حذف المنتج من pending بعد الموافقة
    await pendingProductModel.findByIdAndDelete(id);

    // ✅ Populate للكوفر قبل الإرسال
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

    const deleted = await pendingProductModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    res.status(200).json({ message: "Product rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
