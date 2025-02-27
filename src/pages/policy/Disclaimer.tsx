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

const Disclaimer: React.FC = () => {
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [stateData, setstateData] = useState({});

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
            <h1>Disclaimer</h1>
          </div>
          <div className="policy-content">
            <IonText>
              <h4>Disclaimer</h4>
            </IonText>
            <IonText>
              <p>
                Content on igurufy, whethere from Guru/Influencers or Reviewers
                is user-genrated and not verified or endrosed by IGURUFY. User
                should approach content critically and exercise due diligence.
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
export default Disclaimer;
