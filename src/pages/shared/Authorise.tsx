import React, { useEffect, useState } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  useIonViewWillLeave,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import ConnectionToast from "../../components/ConnectionToast";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import { Network } from "@capacitor/network";
import { useHistory } from "react-router-dom";
import { Browser } from "@capacitor/browser";
import { arrowBackOutline, checkmarkCircleSharp } from "ionicons/icons";

const Authorise: React.FC = () => {
  const authorise = JSON.parse(sessionStorage.getItem("authorisePayment"));
  const history = useHistory();
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [isSubscribe, setIsSubscribe] = useState(false);

  // const logCurrentNetworkStatus = async () => {
  //   const status = await Network.getStatus();
  //   setcheckNetwok(status?.connected);
  //   if (status.connected === false) {
  //     settoastOpen(true);
  //   } else {
  //     settoastOpen(false);
  //     settoastMessage("No Internet Connection!");
  //   }
  // };

  // useEffect(() => {
  //   logCurrentNetworkStatus();
  //   if (checkNetwok === false) {
  //     settoastMessage("Sorry something went wrong!");
  //   } else {
  //     if (authorise === null) {
  //       history.push("/register");
  //     }
  //     axiosData();
  //   }
  // }, []);

  // useIonViewWillLeave(() => {
  //   sessionStorage.removeItem("authorisePayment");
  // });


  const handleLogin = () => {
    history.push("/login");
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonPage>
        <IonContent fullscreen className="main payment-page">
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="ion-text-center">
            <img src={imageIndexing.logo} alt={imageIndexing.logo} />
          </div>
          <div className="content content-sec payment-hding">
            <IonIcon
              className="successCheck"
              icon={checkmarkCircleSharp}
            ></IonIcon>
            <h2>Payment Successfully</h2>
            <div className="payment-method-form">
              <IonButton
                expand="block"
                className="button-inner"
                style={{ marginTop: 50 }}
                onClick={handleLogin}
              >
                Login
              </IonButton>
            </div>
          </div>

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

export default Authorise;
