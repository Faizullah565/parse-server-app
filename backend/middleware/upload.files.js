import upload from "../config/multer.js";
import dotenv from "dotenv";
dotenv.config()

Parse.Cloud.define("uploadImage", async (request) => {

  const files = request.files;

  if (!files || !files.file) {
    throw new Error("No file uploaded");
  }

  const fileData = files.file;
  // console.log("🚀 ~ fileData:", fileData)

  const parseFile = new Parse.File(fileData.name, fileData);
  
  await parseFile.save({ useMasterKey: true });
  
  console.log("🚀 ~ parseFile:", parseFile)
  return {
    url: parseFile.url()
  };

});