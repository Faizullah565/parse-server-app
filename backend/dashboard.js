import ParseDashboard from 'parse-dashboard';
import dotenv from "dotenv";

dotenv.config();

const dashboard = new ParseDashboard({
  apps: [
    {
        
      serverURL: `${process.env.SERVER_URL}/parse`,
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY,
      appName: 'Parse Server E-Commerce App',
    },
  ],
  users: [
    {
      user: 'admin',
      pass: 'admin123',
    },
  ],
}, { allowInsecureHTTP: true });

export default dashboard