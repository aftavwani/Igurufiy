import React, { useEffect, useState } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonMenuToggle,
  IonHeader,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import { NavLink } from "react-router-dom";
import Menu from "./../components/menu/Menu";
import UserMenu from "../components/menu/UserMenu";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";

const WelcomeScreen: React.FC = () => {
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

  useEffect(() => {
    logCurrentNetworkStatus();
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    }
  }, []);
  return (
    <>
      <UserMenu />
      <IonPage id="main-content">
        <IonContent fullscreen className="ion-padding main">
        <IonHeader className="ion-text-center login-main-header header">
            <IonMenuToggle>
              <img src={imageIndexing.toggel} alt={imageIndexing.toggel} />
            </IonMenuToggle>
            <div className="ion-text-center">
              <img src={imageIndexing.logo} alt={imageIndexing.logo} />
            </div>
            <img src={imageIndexing.user} alt={imageIndexing.user} />
          </IonHeader>
          <div className="content content-sec">
            <IonText className="ion-text-center">
              <h4 className="adasdsf">Welcome To IGurufy</h4>
              <div>
                Igurufy is online platform to promote transparency within the
                influencer/guru community by providing one central place for
                feedback and reviews for services purchased online through other
                social media platforms from influencers/gurus.
              </div>
            </IonText>
          </div>
          <NavLink className="register-link welcome-link" to="/register">
            <IonButton expand="block" className="button-inner">
              Get Started
            </IonButton>
          </NavLink>

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
export default WelcomeScreen;
