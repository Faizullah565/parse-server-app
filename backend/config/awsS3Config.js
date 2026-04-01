import dotenv from 'dotenv'
import AWS from "aws-sdk";

dotenv.config() 

  console.log("🚀 ~ process.env.AWS_ACCESS_KEY:", process.env.AWS_ACCESS_KEY)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

export default s3;