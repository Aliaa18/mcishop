import { AppError, catchAsyncError } from "../../utils/error.handler.js";
import imageModel from "../image/models/image.model.js";
import { makeImage } from "../image/utils/image.utils.js";
import settingsModel from "./settings.model.js";
        
 


export const getSettings = catchAsyncError(async (req, res, next) => {
  const setts = await settingsModel.find({}).populate('images');

  if (!setts || setts.length === 0) {
    return res.status(404).json({ success: false, message: 'No settings found' });
  }

  res.status(200).json({
    success: true,
    message: 'Settings retrieved successfully',
    setts,
  });
});

export const addSettings = catchAsyncError(async (req, res, next) => {
    const imageIds = [];
  
    // Handle uploaded images
    if (req.files.images?.length > 0) {
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path)
            imageIds.push(image._id);
          } catch (error) {
            return next(error);
          }
        })
      );
    }

        console.log(imageIds);
        if (req.body.services && typeof req.body.services === 'string') {
            try {
              req.body.services = JSON.parse(req.body.services);
            } catch (error) {
              return next(new AppError('Invalid JSON in services field', 400));
            }
          }
          
          
    // Create the Settings document with image references
    const sett = await settingsModel.create({
     ...req.body,
     images:imageIds
 } );
      console.log(req.files);
      
    res.status(201).json({
      message: `Settings created with ${imageIds.length} image(s)`,
       sett,
    });
  });
  export const updateSettings = catchAsyncError(async (req, res, next) => {
    const setting = await settingsModel.findById(req.params.setting_id);
    if (!setting) throw new AppError('Setting Not Found', 404);
  
    // 1. Delete old images from DB
    
    
    // 2. Handle new uploaded images
    const newImgIds = [];
    if (req.files.images?.length > 0) {
        await Promise.all(
            setting.images.map(async (imageId) => {
              try {
                await imageModel.findByIdAndDelete(imageId);
              } catch (err) {
                return next(err);
              }
            })
          );
      await Promise.all(
        req.files.images.map(async (file) => {
          try {
            const image = await makeImage(file.path)
            newImgIds.push(image._id);
          } catch (error) {
            return next(error);
          }
        })
      );
    }
     console.log(req.files);
     if (req.body.services && typeof req.body.services === 'string') {
        try {
          req.body.services = JSON.parse(req.body.services);
        } catch (error) {
          return next(new AppError('Invalid JSON in services field', 400));
        }
      }
    // 3. Update the setting document
    const updatedSetting = await settingsModel.findByIdAndUpdate(
      req.params.setting_id,
      {
        ...req.body,
        images: newImgIds,
      },
      { new: true } // <-- Return updated document
    );
  
    res.status(200).json({
      message: `Setting updated with ${newImgIds.length} image(s)`,
      setting: updatedSetting,
    });
  });
  


 

export const deleteSettings = catchAsyncError(async (req, res, next) => {
	const setting = await settingsModel.findOneAndDelete({
		_id: req.params.setting_id,
	})
	res.json({ setting })
})