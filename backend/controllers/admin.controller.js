export const AdminfetchAllUsers = async (request) => {
  try {
    const currentUser = request.user;

    //  Not logged in
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    //  Check admin role (Parse.Role)
    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo("name", "admin");
    roleQuery.equalTo("users", currentUser);

    const isAdmin = await roleQuery.first({ useMasterKey: true });

    if (!isAdmin) {
      throw new Error("Access denied: Admin only");
    }

    //  Fetch users
    const query = new Parse.Query(Parse.User);
    query.descending("createdAt");
    query.limit(100);

    const users = await query.find({ useMasterKey: true });

    //  Helper to get role safely
    const getUserRole = async (user) => {
      const rQuery = new Parse.Query(Parse.Role);
      rQuery.equalTo("users", user);

      const role = await rQuery.first({ useMasterKey: true });

      return role ? role.get("name") : "user";
    };

    //  Format users
    const formattedUsers = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        name: user.get("name"),
        email: user.get("email"),
        //  Safe role (no error now)
        role: await getUserRole(user),

        //  Status field
        status: user.get("emailVerified"),

        createdAt: user.createdAt,
      }))
    );

    return {
      success: true,
      users: formattedUsers,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};