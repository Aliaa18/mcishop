import { Router } from 'express'

import { addSettings, deleteSettings, getSettings, updateSettings } from './settings.controller.js'
import { upload } from '../../middlewares/upload.middleware.js'
import { validate } from '../../middlewares/validation.middleware.js'
import { addSettingsSchema } from './settings.validation.js'


 const router = Router()

router
    .route('/')
    .get(getSettings)
    .post(
          validate(addSettingsSchema),
        upload.fields([
                { name: 'images', maxCount: 10 },
            ]),
            addSettings)
router
    .route('/:setting_id')
    .delete(deleteSettings)
    .put( upload.fields([
        { name: 'images', maxCount: 10 },
    ]),updateSettings)
   


export default router