import Parse from "parse"


const restoreUser = async () => {
  const sessionToken = localStorage.getItem("sessionToken");

  if (!sessionToken) return null;

  try {
    const user = await Parse.User.become(sessionToken);
    console.log(" User restored:", user);
    return user;
  } catch (err) {
    console.error(" Invalid session:", err);
    return null;
  }
};

export default restoreUser