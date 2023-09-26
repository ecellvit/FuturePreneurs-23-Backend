const Joi = require("joi");

module.exports = {
    googleAuthBodyValidation: (body) => {
        const schema = Joi.object({
            token: Joi.string().required(),
            email: Joi.string().email().required(),
        });
        return schema.validate(body);
    },
};