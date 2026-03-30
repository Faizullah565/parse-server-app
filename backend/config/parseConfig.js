import dotenv from "dotenv";

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
    liveQueryServerURL: "ws://localhost:1337/parse"
  },

  fileUpload: {
    allowedFileUrlDomains: ["localhost"]
  },

  pages: {
    encodePageParamHeaders: true
  }

};