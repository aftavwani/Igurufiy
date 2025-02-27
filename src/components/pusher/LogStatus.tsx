import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { App } from "@capacitor/app";

interface UserStatus {
  userId: string;
  status: string; // 'online' or 'offline'
}

interface PusherComponentProps {
  channelName: string;
  eventName: string;
}

const PusherComponent: React.FC<PusherComponentProps> = ({
  channelName,
  eventName,
}) => {
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const getUserData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const handleAppStateChange = (state: { isActive: boolean }) => {
      if (state.isActive) {
        console.log('App is in the foreground');
        // You can perform actions when the app comes to the foreground
        const Url = process.env.API_SOME_KEY + "login-status/";

        fetch(Url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 1, id: getUserData?.id }),
        })
          .then((response) => {
            if (response.ok) {
              // Success
            } else {
              // Error handling
            }
          })
          .catch((error) => console.error("Error updating user status", error));
      } else {
        console.log('App is in the background');
        // You can perform actions when the app goes to the background
        const Url = process.env.API_SOME_KEY + "login-status/";

        fetch(Url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: 0, id: getUserData?.id }),
        })
          .then((response) => {
            if (response.ok) {
              // Success
            } else {
              // Error handling
            }
          })
          .catch((error) => console.error("Error updating user status", error));
      }
    };

    // Add event listeners
    App.addListener('appStateChange', handleAppStateChange);

    // Cleanup the listener when the component unmounts
    return () => {
      App.removeAllListeners();

      const Url = process.env.API_SOME_KEY + "login-status/";

      fetch(Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: 0, id: getUserData?.id }),
      })
        .then((response) => {
          if (response.ok) {
            // Success
          } else {
            // Error handling
          }
        })
        .catch((error) => console.error("Error updating user status", error));
    };
  }, []);

  return null;
};

export default PusherComponent;
