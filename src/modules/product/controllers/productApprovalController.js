import pendingProductModel from "../models/pendingProduct.model.js";
import productModel from "../models/product.model.js";
import product from "../models/product.model.js";

// ✅ اعتماد المنتج (Approve)
export const approveProduct = async (req, res) => {
 try {
    const { id } = req.query;
    const pendingProduct = await pendingProductModel.findById(id);

    if (!pendingProduct) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    // ✅ 1) إنشاء المنتج في كولكشن products (بدون صور حالياً)
    const newProduct = await productModel.create({
      title: pendingProduct.title,
      price: pendingProduct.price,
      stock: pendingProduct.stock,
      description: pendingProduct.description,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      cover_image: null, // هيتضاف بعدين
    });

    // ✅ 2) إنشاء الـ cover image
    let coverImageDoc = null;
    if (pendingProduct.coverImagePath) {
      const img = await imageModel.create({ url: pendingProduct.coverImagePath });
      coverImageDoc = img;
      newProduct.cover_image = img._id;
      await newProduct.save();
    }

    // ✅ 3) إنشاء صور الجاليري داخل image + imageOnProduct
    if (pendingProduct.imagePaths?.length) {
      await Promise.all(
        pendingProduct.imagePaths.map(async (url) => {
          const image = await imageModel.create({ url });
          await imageOnProductModel.create({
            image_id: image._id,
            product_id: newProduct._id,
          });
        })
      );
    }

    // ✅ 4) حذف المنتج من pending بعد الاعتماد
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
