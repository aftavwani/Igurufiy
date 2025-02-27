import React from "react";
import { IonToast } from "@ionic/react";
import { Network } from "@capacitor/network";

const ConnectionToast: React.FC = (prop: any) => {
  Network.addListener("networkStatusChange", (status) => {
    prop.setcheckNetwok(status?.connected);

    if (status.connected === false) {
      prop.settoastOpen(true);
    } else {
      prop.settoastOpen(false);
      prop.settoastMessage("No Internet Connection!");
    }
  });

  return (
    <>
      <IonToast
        isOpen={prop.toastOpen}
        message={prop.toastMessage}
        buttons={[
          {
            text: "Dismiss",
            role: "cancel",
            handler: () => {
              prop.settoastOpen(false);
            },
          },
        ]}
      ></IonToast>
    </>
  );
};
export default ConnectionToast;
