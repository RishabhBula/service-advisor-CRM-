"use strict";

const { upload } = require("../models");
const fs = require("fs");
const path = require("path");
const __basedir = path.join(__dirname, "../public");
const Jimp = require('jimp');

const resizeImage = async (sourcePath, destinationPath, width) => {
   return new Promise((resolve, reject) => {
      Jimp.read(sourcePath, function (err, lenna) {
         if (err) {
            console.log("*********** Resize Error =>", err);
            reject(new Error(err));
         }
         lenna
            .resize(width, Jimp.AUTO)
            .quality(100)
            .write(destinationPath); // save

         resolve(destinationPath);
      }
      )
   });
};
const uploadFiles = async (req, res) => {
   try {
      const data = req.file;
      if (!data) {
         return res.status(401).json({
            responseCode: 401,
            message: "Not provided any file to upload!",
            success: false,
         });
      }
      const imagePath = path.join(__basedir, '/images/', data.filename);
      const thumbnailPath = path.join(__basedir, '/images-thumbnail/', data.filename);
      await resizeImage(imagePath, thumbnailPath, 600);
      const imageName = path.join('/images/', data.filename);
      const thumbnailName = path.join('/images-thumbnail/', data.filename);
      const upd = new upload({
         type: data.mimetype,
         name: data.originalname,
         data: imageName,
         thumbnailImage: thumbnailName,
         userId: data.userId
      });
      const uploadData = await upd.save();
      return res.status(200).json({
         responseCode: 200,
         message: "File uploaded successfully!",
         data: "/images/" + data.filename,
         fileData: uploadData,
         success: true,
      });
   } catch (error) {
      return res.status(400).json({
         responseCode: 400,
         message: "Error while saving file!",
         error: error,
         success: false,
      });
   }
};

module.exports = {
   uploadFiles,
};