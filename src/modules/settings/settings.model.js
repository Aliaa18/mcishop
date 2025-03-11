import mongoose from 'mongoose'
import slugify from 'slugify'

const settingsSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        facebookAddress: {
            type: String,
            required: true,
        },
        linkedinAddress: {
            type: String,
            required: true,
        },
        webSite: {
            type: String,
            required: true,
        },
        services: [
            {
              key: {
                type: String,
                required: true,
              },
              value: {
                type: String,
                required: true,
              }
            }
          ],
          images: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'image', 
            }
          ]
        
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)




settingsSchema.pre(/delete/i, async function (next) {
    const toBeDeleted = await this.model.findOne(this._conditions);
    if (!toBeDeleted) return next();
  
    await Promise.all(
      toBeDeleted.images.map(async (imageId) => {
        await mongoose.model('image').findByIdAndDelete(imageId);
      })
    );
    next();
  });
  

settingsSchema.pre(/update/i, async function (next) {
    if (!this._update.images) return next()
    const toBeUpdated = await settingsModel.findOne(this._conditions)
    if (!toBeUpdated) return next()

        await Promise.all(
            toBeUpdated.images.map(async (image) => {
                await mongoose.model('image').findByIdAndUpdate(image._id)
            })
        )
    next()
})


const settingsModel = mongoose.model('setting', settingsSchema)

export default settingsModel