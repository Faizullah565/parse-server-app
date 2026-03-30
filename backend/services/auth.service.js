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
    // console.log("🚀 ~ loginService ~ user:", user)
    // ////////////////////// get user role
    const rolePointer = user.get("role");

    let roleName = null;

    if (rolePointer) {
      const roleQuery = new Parse.Query("_Role");
      const role = await roleQuery.get(rolePointer.id, { useMasterKey: true });

      roleName = role.get("name"); // 🔥 admin / user / seller
    }
    return {
      success: true,
      message: "Login Successful",
      user: {
        id: user.id,
        name: user.get("name"),
        image:user.get("image"),
        email: user.get("email"),
        sessionToken: user.getSessionToken(),
        phone:user.get("phone"),
        role: roleName || null,
        createdAt:user.createdAt,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}


export const updateProfileService = async (name, email, phone, image, sessionToken) => {
  try {

    // FIND USER BY EMAIL
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("email", email);

    const user = await userQuery.first({ sessionToken, useMasterKey: true });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // UPDATE FIELDS
    if (name) user.set("name", name);
    if (phone) user.set("phone", phone);
    if (email) user.set("email", email);
    if (image) user.set("image", image);

    // SAVE USER
    const result = await user.save(null, { useMasterKey: true });

    return {
      success: true,
      message: "Profile Updated Successfully",
      user: {
        id: result.id,
        username: result.get("username"),
        email: result.get("email"),
        name: result.get("name"),
        phone: result.get("phone"),
        image: result.get("image"),
      },
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUserProfileService = async (user) => {
  try {
    const query = new Parse.Query(Parse.User);
    const currentUser = await query.get(user.id, {
      useMasterKey: true,
    });

    // ////////////////////// get user role
    const rolePointer = currentUser.get("role");

    let roleName = null;

    if (rolePointer) {
      const roleQuery = new Parse.Query("_Role");
      const role = await roleQuery.get(rolePointer.id, { useMasterKey: true });

      roleName = role.get("name"); // 🔥 admin / user / seller
    }
    // 4. Return clean user profile
    return {
      id: currentUser.id,
      name: currentUser.get("name"),
      email: currentUser.get("email"),
      phone: currentUser.get("phone"),
      image: currentUser.get("image"),
      role: roleName || "user",
      createdAt: currentUser.createdAt,
      
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};


export const changePasswordService = async (oldPassword, newPassword, user) => {
  try {
    // First, verify the old password by logging in
    try {
      await Parse.User.logIn(user.get("username"), oldPassword);
    } catch (loginError) {
      throw new Error("Current password is incorrect");
    }

    // Get the user to update
    const query = new Parse.Query(Parse.User);
    const currentUser = await query.get(user.id, { useMasterKey: true });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Set the new password
    currentUser.setPassword(newPassword);

    // Save the user with master key
    await currentUser.save(null, { useMasterKey: true });

    return {
      success: true,
      message: "Password updated successfully"
    };

  } catch (error) {
    console.error("Password change error:", error);
    return {
      success: false,
      message: error.message || "Failed to update password"
    };
  }
};