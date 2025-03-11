import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { AppError } from './utils/error.handler.js'
import v1Router from './routers/v1.routes.js'

const bootstrap = (app) => {
	
	app.use(express.json())
	app.use(cors({
		origin: '*', // You can restrict this later to specific domains
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization']
	  }));
	app.options('*', cors()); 
	app.use(morgan('dev'))
     app.get('/' , (req, res, next) => {
		return res.status(200 ).json({
			message:"welcome"
		})
	} )
	app.use('/api/v1', v1Router)

	app.all('*', (req, res, next) => {
		throw new AppError('Route not found', 404)
	})


	app.use((err, req, res, next) => {
		const { message, status, stack } = err
		res.status(status || 500).json({
			message,
			...(process.env.MODE === 'development' && { stack }),
		})
	})
}

export default bootstrap
