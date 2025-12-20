import {
  createContext,
 
} from "react";
import type { NewsContextValue } from "../types/newsType";


export const NewsContext = createContext<NewsContextValue | null>(null);
