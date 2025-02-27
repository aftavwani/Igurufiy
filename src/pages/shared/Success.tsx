import React, { useState, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  useIonViewWillLeave,
  IonText,
  IonIcon,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";
import { useHistory } from "react-router-dom";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import { checkmarkCircleOutline } from "ionicons/icons";

const Success: React.FC = () => {
  const successData = JSON.parse(sessionStorage.getItem("SuccessData"));
  const history = useHistory();
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);

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
    } else {
      if (successData === null) {
        history.push("/register");
      }
    }
  }, []);

  useIonViewWillLeave(() => {
    sessionStorage.removeItem("SuccessData");
  });

  return (
    <>
      <IonPage>
        <IonContent fullscreen className="main payment-page">
          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="ion-text-center">
            <img src={imageIndexing.logo} alt={imageIndexing.logo} />
          </div>
          <div className="success-process">
            <h1>Success!</h1>
            <IonIcon icon={checkmarkCircleOutline}></IonIcon>
            <IonText>
              Guru Registration Successful! Please wait 24 HRS for your profile
              to be authenticated and approved! Check your email for approval!
              Thank you for your patience! - IGURUFY TEAM
            </IonText>
            <div>
              <h3>Payment Information</h3>
              <IonText>Reference Number: #{successData?.id}</IonText>
              <IonText>
                <b>Subscription ID:</b> {successData?.paypal_subscr_id}
              </IonText>
              <IonText>
                {" "}
                <b>TXN ID:</b> {successData?.paypal_order_id}
              </IonText>
              <IonText>
                <b>Paid Amount: </b> {successData?.paid_amount}{" "}
                {successData?.currency_code}
              </IonText>
              <IonText>
                <b>Status: </b> {successData?.status}
              </IonText>
            </div>

            <div>
              <h3>Subscription Information</h3>
              <IonText>
                <b>Plan Name: </b>
                {successData?.plan?.name}
              </IonText>
              <IonText>
                <b>Amount:</b> {successData?.plan?.price}{" "}
                {successData?.plan?.currency.toUpperCase()}
              </IonText>
              <IonText>
                <b>Plan Interval:</b>{" "}
                {successData?.plan?.billing_method === "month"
                  ? "Monthly"
                  : successData?.plan?.billing_method}
              </IonText>
              <IonText>
                <b>Period Start:</b> {successData?.valid_from}
              </IonText>
              <IonText>
                <b>Period End:</b> {successData?.valid_to}
              </IonText>
              <IonText>
                <b>Next Payment On:</b> {successData?.valid_to}
              </IonText>
            </div>

            <div>
              <h3>Payer Information</h3>
              <IonText>
                <b>Name:</b> {successData?.subscriber_name}
              </IonText>
              <IonText>
                <b>Email:</b> {successData?.subscriber_email}
              </IonText>
            </div>
          </div>

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
export default Success;
