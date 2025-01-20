import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { AppError } from '../utils/error.handler.js'

const storage = multer.diskStorage({
	// destination: function (req, file, cb) {
	// 	cb(null, 'uploads/')
	// },
	// filename: function (req, file, cb) {
	// 	cb(null, uuidv4() + '-' + file.originalname)
	// },
})

function fileFilter(req, file, cb) {
	if (!file.mimetype.startsWith('image'))
		return cb(new AppError('Images only!', 400), false)

	cb(null, true)
}

export const upload = multer({ storage, fileFilter })
