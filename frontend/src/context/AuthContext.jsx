import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUser, removeUser, saveToken, saveUser } from "../../utils/storedData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser("user") || {});
  const [sessionToken, setSessionToken] = useState(getToken("sessionToken") || null);
  
  //======= LOAD TOKEN ON REFRESH ==============
  useEffect(() => {
    const savedToken = getToken("sessionToken");
    if (savedToken) setSessionToken(savedToken);
    const savedUser = getUser("user");
    if (savedUser) setUser(savedUser);
  }, []);

  // ==========USER LOGIN ===================
  const login = (userData) => {

    //========== SET TOKEN ==========================
    saveToken("sessionToken", userData?.user?.sessionToken);
    //========== GET TOKEN ==========================
    setSessionToken(getToken("sessionToken"));

    //========== SET USER ==========================
    saveUser("user", userData?.user)
    //========== GETT USER ==========================
    setUser(getUser("user"));

  };

  // ========= UPDATE LOGIN USER PROFILE ==========
  const updateProfile = (data) => {
    removeUser("user");
    let user = data?.data;
    saveUser("user", user);
    setUser(getUser("user"));
  };
  
  // ========= LOGOUT USER AND CLEAR LOCALSTORAGE ============
  const logout = () => {
    localStorage.clear();
    setSessionToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, sessionToken, login, logout, setUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);