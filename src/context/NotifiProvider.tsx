import React, { useState } from "react";
import { NotifiContext } from "./NotifiContext";

export const NotifiProvider: React.FC = ({ children }) => {
  const [notifiCount, setNotifiCount] = useState<any>(null);

  return (
    <NotifiContext.Provider
      value={{ notifiCount, setNotifiCount}}
    >
      {children}
    </NotifiContext.Provider>
  );
};
