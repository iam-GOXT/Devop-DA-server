const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Get the cloudinary credentials

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "abraham-and-mercy",
  api_key: 487342662299535,
  api_secret: "S_pVpoBKMyy5VZLraumkiLXOxbA",
});

module.exports = cloudinary;

// export const uploader = async (file, options) => {
//   try {
//     const response = await cloudinary.uploader.upload(file, options);
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

// Get file from request
// const sourceFile = img_path

// // Get the secure url of the uploaded file
// // upload the file to cloudiinary
// const response = await cloudinary.uploader.upload(sourceFile, { resource_type: 'auto'});

// const secureUrl = response.secure_url;

// return secureUrl;
