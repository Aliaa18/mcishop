import mongoose from "mongoose";

const pendingProductSchema = new mongoose.Schema({
  title: {
            type: String,
            minLength: 3,
            maxLength: 1000,
            required: true,
            trim: true,
            unique: true,
        },
      
        description: {
            type: String,
            minLength: 3,
            maxLength: 10000,
            required: true,
            trim: true,
        },
        apps: {
            type: String,
            trim: true,
        },
        stock: {
            type: Number,
            min: 0,
            required: true,
        },
        price: {
            type: String,
        },
        discounted_price: {
            type: Number,
            min: 0.01,
            validate: {
                validator: function (value) {
                    return value <= this.price
                },
                message:
                    'The discounted price must not exceed the initial price',
            },
        },
        
        features: {
            type:String,
            minLength: 3,
            maxLength: 10000,
            trim: true,
        },
        subcategory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subcategory',
            
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            
        },
        brand_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"brand"
        }
        
   ,
  // هنخزن هنا الملفات المؤقتة
  coverImagePath: String,
  imagePaths: [String],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 const pendingProductModel = mongoose.model(
  "PendingProduct",
  pendingProductSchema
)
export default pendingProductModel