const Joi = require("joi")


const quizSchema = Joi.object({
    subject_id: Joi.number().strict().required(),
    class_id: Joi.number().strict().required(),
    quiz_title: Joi.string().strict().required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().required(),
    created_by: Joi.string().strict().required(),

})
const questionSchema = Joi.object({
    quiz_id: Joi.number().strict().required(),
    question: Joi.string().strict().required(),
    options: Joi.array().items(Joi.string().strict()).length(4).required(),
    correct_answer: Joi.number().strict().required(),
    created_by: Joi.string().strict().required(),
})


module.exports = { quizSchema, questionSchema }