import React, { useState, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import { IonContent, IonPage, IonButton, IonText, IonIcon, IonHeader } from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import { NavLink, Link } from "react-router-dom";
import { arrowBackCircle } from "ionicons/icons";
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";

const Register: React.FC = () => {
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
    <IonPage>
      <IonContent fullscreen className="main">
      <IonHeader className="ion-text-center login-main-header">
          <NavLink to="/index">
            <IonIcon
              className="back-icon"
              icon={arrowBackCircle}
              size="large"
            ></IonIcon>
          </NavLink>

          <Link to="/index">
            <img src={imageIndexing.logo} alt={imageIndexing.logo} />
          </Link>
        </IonHeader>
        <div className="content content-sec">
          <IonText className="ion-text-center">
            <h4 className="adasdsf">Welcome To Igurufy</h4>
            <div>
              Igurufy is an online platform to Rate & Review Gurus around the
              world
            </div>
          </IonText>

          <div>
            <NavLink className="register-link" to="/reviewer-registration">
              <IonButton
                className="button-inner ion-margin-bottom"
                expand="block"
              >
                Register as a Reviewer
              </IonButton>
            </NavLink>
            <NavLink className="register-link" to="/guru-registration">
              {" "}
              <IonButton className="button-inner" expand="block">
                Register as Guru(Influencer)
              </IonButton>
            </NavLink>
          </div>

          <IonText className="ion-text-center">
            Have an Account?{" "}
            <NavLink className="login-link" to="/login">
              Log In
            </NavLink>
          </IonText>
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
  );
};
export default Register;
