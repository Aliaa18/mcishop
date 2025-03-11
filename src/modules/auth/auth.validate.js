import Joi from 'joi'

export const signinSchema = Joi.object({
	body: {
		email: Joi.string().required(),
		password: Joi.string().required(),
	},
	params: {},
	query: {},
})

export const signupSchema = Joi.object({
	body: {
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ['com', 'net'] },
			})
	, phone: Joi.string()
	.pattern(/^01[0125][0-9]{8}$/)
	.required()
	.messages({
	  'string.pattern.base': 'Phone number must be a valid Egyptian number (e.g. 010xxxxxxxx).',
	  'string.empty': 'Phone number is required.',
	})
  
	 ,
		password: Joi.string()
			
			.pattern(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
			),
			companyName: Joi.string(),
			role: Joi.string().valid('USER', 'ADMIN').default('USER').optional(),
	},
	params: {},
	query: {},
})

export const validateEmailSchema = Joi.object({
	body: {},
	params: {
		token: Joi.string().hex().length(24)
	},
	query: {},
})
export const updateUserSchema = Joi.object({
	body: {
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ['com', 'net'] },
			})
	,phone: Joi.string()
	.pattern(/^01[0125][0-9]{8}$/)
	.required()
	.messages({
	  'string.pattern.base': 'Phone number must be a valid Egyptian number (e.g. 010xxxxxxxx).',
	  'string.empty': 'Phone number is required.',
	}),
		password: Joi.string()
			
			.pattern(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
			),
			companyName: Joi.string(),
			role: Joi.string().valid('USER', 'ADMIN').default('USER').optional(),
	},
	params: { user_id: Joi.string()
		.pattern(/^[0-9a-fA-F]{24}$/) // Ensures it's a valid hexadecimal ObjectId
		.required()
		.messages({
		  "string.pattern.base": "Invalid user_id format! Must be a valid ObjectId.",
		  "any.required": "user_id is required!",
		})
	   },
	query: {},
	
})

export const deleteUserSchema = Joi.object({
	body: {},
	params: { user_id: Joi.string()
		.pattern(/^[0-9a-fA-F]{24}$/) // Ensures it's a valid hexadecimal ObjectId
		.required()
		.messages({
		  "string.pattern.base": "Invalid user_id format! Must be a valid ObjectId.",
		  "any.required": "user_id is required!",
		})
	   },
	query: {},

})


export const forgetPasswordSchema =Joi.object({
    body:{
        email:Joi.string().email({
            minDomainSegments:2,
            maxDomainSegments:5,
            tlds:{allow:["com" , "net"]}
           }).required() 
    },
    query:{},
    params:{}
    
})
export const resetPasswordSchema =Joi.object({
	body: Joi.object({
		newPassword: Joi.string()
		  .pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		  )
		  .required()
		  .messages({
			'string.pattern.base': 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
			'any.required': 'New password is required.'
		  }),
	  }),
	  params: Joi.object({
		token: Joi.string().required() // JWT token — just check it's a string
	  }),
    query:{token: Joi.string().hex().length(24)},
  
    
})