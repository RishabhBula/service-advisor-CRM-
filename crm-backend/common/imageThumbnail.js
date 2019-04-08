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
module.exports = {
   resizeImage
};