import { catchAsyncError } from '../utils/error.handler.js'

export const executeQuery = ({ status = 200 } = {}) => {
	return catchAsyncError(async (req, res, next) => {
		const message = await req.query
		res.status(status).json({ message })
	})
}
