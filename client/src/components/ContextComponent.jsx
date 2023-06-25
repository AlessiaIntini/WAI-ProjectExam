import { createContext, useEffect, useState } from 'react';
import API from "../API"
import { Routes } from 'react-router-dom';

// Create a new context
const TitleContext = createContext();

const TitleProvider = ({...props}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Define an async function to fetch the title from the API
    const getTitle = async () => {
      try {
        const editTitle = await API.getTitle()
        setTitle(editTitle.titleAdmin);
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };

    // Call the function to get the title
    getTitle();
  }, []);

  return (
    <TitleContext.Provider value={title}
      {...props}
   />
  );
};

export { TitleContext, TitleProvider };
