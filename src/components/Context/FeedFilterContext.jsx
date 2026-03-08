import { createContext, useState } from "react";

export const feedFilterContext = createContext();

export default function FeedFilterContext({ children }) {
  // Can be "all", "myPosts", or "saved"
  const [feedFilter, setFeedFilter] = useState("all");

  return (
    <feedFilterContext.Provider value={{ feedFilter, setFeedFilter }}>
      {children}
    </feedFilterContext.Provider>
  );
}
