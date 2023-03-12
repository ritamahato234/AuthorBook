var joi = require('joi'); //require joi

module.exports = {
    //middleware validation for author add api
    authoradd: (req, res, next) => {
        const rules = joi.object({
            //define joi object
            Name: joi.string().required().min(2).regex(/^[A-Z]+ [A-Z]+$/i).trim(true).messages({
                'string.base': `"Name" should be a type of 'text'`,
                'string.empty': `"Name" cannot be an empty field`,
               'string.min':   `"Name" cannot be less than 2 character`,
                'any.required': `"Name" is a required field`
            }),
            Description: joi.string().min(3).required().messages({
                'string.base': `"Description" should be a type of 'text'`,
                'string.empty': `"Description" cannot be an empty field`,
                'string.min': `"Description" should have a minimum length of {#limit}`,
                'any.required': `"Description" is a required field`,
            }),
            Country: joi.string().uppercase().options({convert:false}).required().messages({
                'string.base': `"Country" should be a type of 'text'`,
                'string.empty': `"Country" cannot be an empty field`,
                'any.required': `"Country" is a required field`,
                'any.uppercase': `"Country" is a uppercase field`,
            }),

        })

//validate the rules object
        const value = rules.validate(req.body);
        if (value.error) {
            console.log('errors', value.error);
            res.status(200).json({
                massage: value.error.message,
                statuscode: 422,
                sucess: false,
                data: value.error,
            });
        } else {
            next();
        }
    },
    //middleware validation for book add api
    bookadd: (req, res, next) => {
        // console.log(`print body:`, req.body);
        // console.log(`print image:`, req.files);
        const rulesBody = joi.object({

            //define joi object
            Name: joi.string().required().messages({
                'string.base': `"Name" should be a type of 'text'`,
                'string.empty': `"Name" cannot be an empty field`,
                'any.required': `"Name" is a required field`,
            }),
            Description: joi.string().required().messages({
                'string.base': `"Description" should be a type of 'text'`,
                'string.empty': `"Description" cannot be an empty field`,
                'any.required': `"Description" is a required field`,
            }),
            Author: joi.required().messages({
                'any.required': `"Author" is a required field`,
            }),
            Price: joi.number().required().positive().greater(0).messages({
                'any.required': `"Price" is a required field`,
                'any.number': `"Price" is a numberfield`,
                'any.positive': `"Price" is a positive no field`,

            }),

        });
        //validate the rules object
        const bodyValue = rulesBody.validate(req.body);

        if (bodyValue.error) {
            console.log('errors', bodyValue);
            res.status(200).json({
                massage: bodyValue.error.message,
                statuscode: 422,
                sucess: false,
                data: bodyValue.error,
            });
        } else {
            const rulesFiles = joi.object({
                Image: joi.required().error(new Error(`image is required`)),

            })
            //validate the image 
            const filesValue = rulesFiles.validate(req.files);
            if (filesValue.error) {
                res.status(200).json({
                    message: filesValue.error.message,
                    statuscode: 422,
                    success: false,
                    data: filesValue.error
                })
            }
            else {
                next();
            }
        }
    },
    //middleware validation for book edit
    bookedit: (req, res, next) => {
        // console.log(`print body:`, req.body);
        // console.log(`print image:`, req.files);
        const rulesBody = joi.object({

            //define joi object
            bookid: joi.required().messages({
                'any.required': `"bookid" is a required field`,
            }),
            Name: joi.string().required().messages({
                'string.empty': `"Name" cannot be an empty field`,
                'any.required': `"Name" is a required field`,
            }),
            Description: joi.string().optional(),
            Author: joi.required().optional(),
            Price: joi.number().optional().positive().greater(0)

        });
        
        const bodyValue = rulesBody.validate(req.body);

        if (bodyValue.error) {
            console.log('errors', bodyValue);
            res.status(200).json({
                massage: bodyValue.error.message,
                statuscode: 422,
                sucess: false,
                data: bodyValue.error,
            });
        } else {
            const rulesFiles = joi.object({
                Image: joi.optional()

            });
            const filesValue = rulesFiles.validate(req.files);
            if (filesValue.error) {
                res.status(200).json({
                    message: filesValue.error.message,
                    statuscode: 422,
                    success: false,
                    data: filesValue.error
                })
            }
            else {
                next();
            }
        }
    },
    //middleware validation for bookdelete validation
    bookdelete: (req, res, next) => {
        const rules = joi.object({
            //define joi object
            bookid: joi.required().messages({
                'any.required': `"bookid" is a required field`
            }),
           
        })
        const value = rules.validate(req.body);
        if (value.error) {
            console.log('errors', value.error);
            res.status(200).json({
                massage: value.error.message,
                statuscode: 422,
                sucess: false,
                data: value.error,
            });
        } else {
            next();
        }
    },


}