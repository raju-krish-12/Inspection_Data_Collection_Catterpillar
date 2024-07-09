// DataContext.js

import React, { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [formData, setFormData] = useState([]);

  const addFormData = (data) => {
    setFormData([...formData, data]);
  };

  return (
    <DataContext.Provider value={{ formData, addFormData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
