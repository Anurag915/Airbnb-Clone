const Joi = require("joi");
module.exports.listingschema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null),
    category: Joi.array().items(Joi.string().valid(
      'trending',
      'rooms',
      'iconic',
      'mountains',
      'castles',
      'amazing',
      'camping',
      'farms',
      'arctic'
    )).required()
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
