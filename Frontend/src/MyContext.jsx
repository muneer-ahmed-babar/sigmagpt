import { createContext } from "react";

// The shared "box" of data. App.jsx fills it (Provider), other components read it (useContext)
export const MyContext = createContext("");