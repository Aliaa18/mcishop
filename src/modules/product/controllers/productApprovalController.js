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
      let coverImageDoc = null;
    if (pendingProduct.coverImagePath) {
      coverImageDoc = await imageModel.create({
        name: "cover_" + pendingProduct.title,
        path: pendingProduct.coverImagePath,
      });
    }
    //  const coverImage = await makeImage(pendingProduct.coverImagePath);

    // ✅ 1) إنشاء المنتج في كولكشن products (بدون صور حالياً)
    const newProduct = await productModel.create({
      title: pendingProduct.title,
      price: pendingProduct.price,
      stock: pendingProduct.stock,
      description: pendingProduct.description,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      cover_image:coverImageDoc ? coverImageDoc._id : null ,
    });

    // ✅ 3. إنشاء باقي الصور وربطها بالمنتج
    if (pendingProduct.imagePaths && pendingProduct.imagePaths.length > 0) {
      await Promise.all(
        pendingProduct.imagePaths.map(async (imgPath) => {
          const img = await imageModel.create({
            name: "product_" + pendingProduct.title,
            path: imgPath,
          });

          await imageOnProductModel.create({
            image_id: img._id,
            product_id: newProduct._id,
          });
        })
      );
    }

    // ✅ 4. حذف المنتج من pending بعد الموافقة
    await pendingProductModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "✅ Product approved successfully",
      product: newProduct,
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
