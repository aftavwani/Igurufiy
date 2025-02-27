import React, { createContext } from "react";

interface NotifiContextProps {
  notifiCount: any;
  setNotifiCount: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with default values
export const NotifiContext = createContext<NotifiContextProps>({
  notifiCount: null,
  setNotifiCount: () => {},
});
