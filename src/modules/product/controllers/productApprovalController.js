import pendingProductModel from "../models/pendingProduct.model.js";
import product from "../models/product.model.js";

// ✅ اعتماد المنتج (Approve)
export const approveProduct = async (req, res) => {
  try {
    const { id } = req.query; // بناخد الـ id من query ?id=xxxx
    const pendingProduct = await ProductPending.findById(id);

    if (!pendingProduct) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    // إنشاء المنتج الجديد من بيانات الـ Pending
    const newProduct = new Product({
      title: pendingProduct.title,
      price: pendingProduct.price,
      stock: pendingProduct.stock,
      description: pendingProduct.description,
      brand_id: pendingProduct.brand_id,
      subcategory_id: pendingProduct.subcategory_id,
      images: pendingProduct.images,
    });

    await newProduct.save();

    // حذف المنتج من كولكشن pending بعد الاعتماد
    await ProductPending.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product approved successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ رفض المنتج (Reject)
export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const deleted = await ProductPending.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Pending product not found" });
    }

    res.status(200).json({ message: "Product rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
