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
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";

const CookiesPolicy: React.FC = () => {
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
            <h1>Cookies Policy</h1>
          </div>
          <div className="policy-content">
            <IonText>
              <h4>Cookies</h4>
            </IonText>
            <IonText>
              <p>Last updated: August 9, 2023</p>
            </IonText>

            <IonText>
              <p>
                {" "}
                <strong>Purpose</strong>: Cookies enhance user experience,
                provide costomized interraction, and aid in site analytics.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                <strong>Varieties</strong>: We may employ session, persistent,
                or third-party cookies.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                <strong>User Autonomy</strong>: Users can control, limit, or
                reject cookies via browser settings, thought some site
                functionality might be impacted.
              </p>
            </IonText>
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
export default CookiesPolicy;
