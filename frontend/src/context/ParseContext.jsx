// src/context/ParseContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Parse from "parse";

const ParseContext = createContext(null);

export const useParse = () => {
  const context = useContext(ParseContext);
  if (!context) {
    throw new Error('useParse must be used within a ParseProvider');
  }
  return context;
};

export const ParseProvider = ({ children }) => {
  const [parse, setParse] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initParse = () => {
      try {
        // Initialize Parse
        Parse.initialize(
          import.meta.env.VITE_PARSE_APP_ID || "myAppId",
          import.meta.env.VITE_PARSE_JAVASCRIPT_KEY || ""
        );
        
        Parse.serverURL = import.meta.env.VITE_PARSE_SERVER_URL || "http://localhost:1337/parse";
        
        setParse(Parse);
        setInitialized(true);
        console.log("Parse initialized successfully");
      } catch (err) {
        console.error("Parse initialization error:", err);
        setError(err.message);
      }
    };

    initParse();
  }, []);

  return (
    <ParseContext.Provider value={{ parse, initialized, error }}>
      {children}
    </ParseContext.Provider>
  );
};