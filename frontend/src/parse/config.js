// import {Parse} from "parse/dist/parse.min.js";
import Parse from "parse"

Parse.initialize(import.meta.env.VITE_PARSE_APP_ID || "myAppId");

Parse.serverURL =
  import.meta.env.VITE_PARSE_SERVER_URL || "http://localhost:1337/parse";

export default Parse;