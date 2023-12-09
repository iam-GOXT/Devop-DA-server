const joi = require("joi");

// joi validatio schema used to verify req data
const createSchema = joi.object().keys({
  user_id: joi.string(),
  schoolName: joi.string().required(),
  department: joi.string().required(),
  image: joi.string().allow(null, ''),
  logo: joi.string().allow(null, ''),
  beginning: joi.string(),
  city: joi.string(),
  fee: joi.string().required(),
  faculty: joi.string().required(),
  country: joi.string().required(),
  degree: joi.string().required(),
  email: joi.string().required(),
  website: joi.string().uri().required(),
  contact: joi.string().required(),
  courseOverview: joi.string().required(),
  aboutSchool: joi.string().required(),
  funding: joi.string().required(),
  requirement: joi.string().required(),
  services: joi.string().required(),
});

module.exports = { createSchema };
