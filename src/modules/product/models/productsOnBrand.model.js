import mongoose from "mongoose";

let productsOnBrandSchema = new mongoose.Schema({
    product_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'product',
        },
        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'brand',
        },
})


// productsOnBrandModel.pre(/find/, function (next) {
//     this.populate('product_id')
//     next()
// })

// productsOnBrandModel.pre(/delete/i, async function (next) {
//     const toBeDeletedIOP = await productsOnBrandModel.findOne(this._conditions)
//     if (!toBeDeletedIOP) return next()
//     await mongoose.model('product').findByIdAndDelete(toBeDeletedIOP.product_id._id)
// })

// const productsOnBrandModel = mongoose.model(
//     'productsOnBrand',
//     productsOnBrandSchema
// )
export default productsOnBrandModel