import { query } from 'express'
import Joi from 'joi'
import { schemas } from '../../../utils/schema.js'

export const addOrderSchema = Joi.object({
    body: {
        phone_number: schemas.phone_number.required(),
        address: Joi.string().required()
    },
    params: {},
    query: {},
})

export const deleteOrderSchema = Joi.object({
    body:{
        orderId: schemas.modelId.required()
    },
    params:{},
    query:{}
})