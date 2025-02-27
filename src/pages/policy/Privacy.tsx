import React, { useState, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import UserMenu from "../../components/menu/UserMenu";
import Navigate from "../../components/navigation/Navigate";
import Header from "../../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../../components/ConnectionToast";

const PrivacyPolicy: React.FC = () => {
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    setcheckNetwok(status?.connected);

    if (status.connected === false) {
      settoastOpen(true);
    } else {
      settoastOpen(false);
      settoastMessage("No Internet Connection!");
    }
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      if (checkNetwok === false) {
        settoastMessage("Sorry, something went wrong!");
        settoastOpen(true);
      }
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    logCurrentNetworkStatus();
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    }
  }, []);
  return (
    <>
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="banner-img">
            <h1>Privacy</h1>
          </div>
          <div className="policy-content">
            <IonText>
              <h4>Privacy</h4>
            </IonText>
            <IonText>
              <p>Last updated: August 9, 2023</p>
            </IonText>

            <div>
              <IonText>
                <p>
                  Data Collection: Essential user information in collected for
                  service provision.
                </p>
              </IonText>

              <IonText>
                <p>
                  {" "}
                  Data Application: Used mainly for service enhancement
                  notification, and user engagemente.
                </p>
              </IonText>

              <IonText>
                <p>
                  Safety Protocols: We Used industry-grade to measures to
                  protect user data.
                </p>
              </IonText>

              <IonText>
                <p>
                  {" "}
                  <strong>Limited Sharing</strong>: Data is shared only when
                  mandated by law or to ficilate core service functionalities.
                </p>
              </IonText>
            </div>
          </div>

          {/* Footer Navigate bars components */}
          <Navigate />

          {/* Connection Toast Components */}
          <ConnectionToast
            toastOpen={toastOpen}
            settoastOpen={settoastOpen}
            checkNetwok={checkNetwok}
            setcheckNetwok={setcheckNetwok}
            toastMessage={toastMessage}
            settoastMessage={settoastMessage}
          />
        </IonContent>
      </IonPage>
    </>
  );
};
export default PrivacyPolicy;
