import React, { createContext, useContext } from 'react';
import { useQueryClient, QueryClientProvider } from 'react-query';

const PostsContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient(); 

  const contextValue = 
  return (
    <ProductContext.Provider value={queryClient}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(PostsContext);