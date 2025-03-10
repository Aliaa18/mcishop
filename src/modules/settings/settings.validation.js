import Joi from "joi";

export const addSettingsSchema = Joi.object({
    body: Joi.object({
        address: Joi.string().min(3).max(1000).trim(),
        phone: Joi.string()
          .pattern(/^\+201[0125][0-9]{8}$/)
          
          .messages({
            'string.pattern.base': 'Phone number must be a valid Egyptian number starting with +201',
          }),
        email: Joi.string().email(),
        facebookAddress: Joi.string().uri(),
        linkedinAddress: Joi.string().uri(),
        webSite: Joi.string().uri(),
    
        services: Joi.string(), 
      }),
        params: {},
        query: {},
       
})