// import React from "react";

// const titleContext=React.createContext({
//     settings: { title: "CMSmall" },
//     setTitle: () => new Promise(() => null),
// });

//  useEffect(()=>{
//     //get all the pages from API
//     const getTitle=async()=>{
//     let titleA= await API.getTitle().then(
//     setTitle(titleA));
//     }
//     //call function that just create now
//     getTitle();
//   },[]);

// export default titleContext;

import { createContext, useContext, useEffect, useState } from "react"
import API from "../API"

const TitleContext = createContext({
  settings: { title: "CMSmall" },
  editTitle: () => new Promise(() => null)
})

export function AuthProvider({ ...props }) {
  const [settings, setSettings] = useState({})
  
  const saveGlobals = async (key, newSettings) => {
    const data = await API.editTitle(key, newSettings)
    if (data.error) return data
    setSettings({ title: newSettings })
    return data
  }


  return (
    <TitleContext.Provider
      value={{
        settings,
        setGlobals: (key, newSettings) => saveGlobals(key, newSettings),
      }}
      {...props}
    />
  )
}

export function useAuth() {
  const context = useContext(TitleContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}