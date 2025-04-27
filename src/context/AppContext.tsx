import { getCategories } from "@/api/categoryService";
import { CATEGORIES } from "@/constants/queryKeys";
import { Category } from "@/types/Category";
import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

interface AppContextType {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const AppContext = createContext<AppContextType>({
  categories: [],
  isLoading: false,
  isError: false,
  error: null,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [CATEGORIES],
    queryFn: getCategories,
  });

  return (
    <AppContext.Provider value={{ categories, isLoading, isError, error }}>
      {children}
    </AppContext.Provider>
  );
};
