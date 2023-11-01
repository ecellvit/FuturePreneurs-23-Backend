const Joi = require('joi');

module.exports = {
    teamValidation: (body) => {
        const schema = Joi.object({
            teamName: Joi.string().required(),
            leaderName: Joi.string().required(),
            leaderEmail: Joi.string().required(),
            members:Joi.array().required()
            // teamID: Joi.string().required(),
        }).required()
        return schema.validate(body);
    }
};