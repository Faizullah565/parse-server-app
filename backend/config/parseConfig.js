import dotenv from "dotenv";
import S3AdapterPkg from '@parse/s3-files-adapter';
const S3Adapter = S3AdapterPkg.default || S3AdapterPkg;

dotenv.config();


export const config = {

  databaseURI: process.env.MONGO_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,

  serverURL: `${process.env.SERVER_URL}/parse`,
  publicServerURL: `${process.env.SERVER_URL}/parse`,

  cloud: () => import("../cloud/main.js"),
  startLiveQueryServer: true,


  liveQuery: {
    classNames: ["Order", "PushSubscription", "Cart", "Product"],
    // liveQueryServerURL: "ws://localhost:1337/parse"
  },

  fileUpload: {
    enableForPublic: true,
    allowedFileUrlDomains: [
      `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
    ]
  },

  pages: {
    encodePageParamHeaders: true
  },

  filesAdapter: new S3Adapter(
    process.env.AWS_ACCESS_KEY,
    process.env.AWS_SECRET_KEY,
    process.env.AWS_BUCKET,
    {
      region: process.env.AWS_REGION,
      // directAccess: true,
      s3overrides: {
        //This prevents ACL usage
        ACL: undefined
      },
    }
  ),
};