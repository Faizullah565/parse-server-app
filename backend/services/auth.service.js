// import Parse from 'parse/node';

// ================= USER REGISTER SERVICE ==================================
export const registerService = async (username, email, password, aclRole) => {
  try {
    const user = new Parse.User();

    user.set("username", username);
    user.set("email", email);
    user.set("password", password);
    user.set("name", username);

    const result = await user.signUp();

    // FIND AND SET CUSTOMER ROLE
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo("name", aclRole)
    let role = await roleQuery.first({ useMasterKey: true })
    // IF NO ROLE FOUND IN DB THEN CREATE ROLE
    if (!role) {
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(user, true)
      acl.setRoleWriteAccess("Admin", true);
      role = new Parse.Role(aclRole, acl);
      await role.save(null, { useMasterKey: true });
    }

    // ADD USER TO ROLE
    role.getUsers().add(result);
    await role.save(null, { useMasterKey: true });

    //  SAVE ROLEiD IN USER CLASS
    user.set("role", { ...role })

    await user.save(null, { useMasterKey: true })

    return {
      success: true,
      message: "Signup Successful",
      user: {
        id: result.id,
        username: result.get("username"),
        email: result.get("email"),
        name: result.get("name"),
        role,
        // sessionToken: result.getSessionToken(),
      },
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// =========================== LOGIN USER SERVICE ============================
export const loginService = async (email, password) => {
  try {
    const user = await Parse.User.logIn(email, password);
    console.log("🚀 ~ loginService ~ user:", user)

    // // Find roles
    // const roleQuery = new Parse.Query(Parse.Role);
    // roleQuery.equalTo("users", user); // relation check
    // const roles = await roleQuery.find({ useMasterKey: true });
    // const roleNames = roles.map(r => r.get("name")); // ["Admin"], ["Customer"],

    // Parse.Push.send({
    //   channels: ["Giants", "Mets"],
    //   data: {
    //     alert: "The Giants won against the Mets 2-3."
    //   }
    // })
    //   .then(function () {
    //     // Push was successful
    //     console.log("Login successfully")
    //   }, function (error) {
    //     // Handle error
    //     console.log("🚀 ~ loginService ~ error:", error)
    //   });

    return {
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
        sessionToken: user.getSessionToken(),
        role: user.get("role")
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}