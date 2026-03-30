import Parse from "parse"
// console.log("🚀 ~ Parse:", Parse)

const ParseInstance = Parse.default || Parse;
console.log("🚀 ~ ParseInstance:", ParseInstance)
console.log("🚀 ~ ParseInstance.initialize:", ParseInstance.initialize)

if (!ParseInstance.applicationId) {
    ParseInstance.initialize(import.meta.env.VITE_PARSE_APP_ID);
  console.log("🚀 ~ ParseInstance.initialize:", ParseInstance.initialize)
  ParseInstance.serverURL = import.meta.env.VITE_PARSE_SERVER_URL;
  ParseInstance.liveQueryServerURL = "ws://localhost:1337/parse";

  ParseInstance.User.enableUnsafeCurrentUser();
}

export default ParseInstance;