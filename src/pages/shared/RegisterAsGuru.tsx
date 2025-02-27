import React, { useState, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import { IonContent, IonPage, IonText, IonIcon, IonHeader } from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import { Link, NavLink } from "react-router-dom";
import { arrowBackCircle } from "ionicons/icons";
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";

const registerAsGuru: React.FC = () => {
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

          <Link to="/register">
            <IonIcon
              className="back-icon"
              icon={arrowBackCircle}
              size="large"
            ></IonIcon>
          </Link>

          <Link to="/index">
            <img src={imageIndexing.logo} alt={imageIndexing.logo} />
          </Link>
        </IonHeader>
        <div className="content">
          <IonText className="ion-text-center">
            <h4 className="adasdsf">Guru Registration</h4>
            <div>
              Register as Instagram Guru(Influencer) and Register as TikTok
              Guru(Influencer)
            </div>
          </IonText>

          <div className="guru-register">
            <NavLink to="/instagram-registration">
              <button className="guru-register-btn">
                <img src={imageIndexing.vector} alt={imageIndexing.vector} />{" "}
                Register as Instagram Guru (Influencer)
              </button>
            </NavLink>
            <NavLink to="/tiktok-registration">
              <button className="guru-register-btn">
                <img src={imageIndexing.vector} alt={imageIndexing.vector} />{" "}
                Register as TikTok Guru (Influencer)
              </button>
            </NavLink>
            <NavLink to="/both-registration">
              <button className="guru-register-btn">
                <img src={imageIndexing.vector} alt={imageIndexing.vector} />{" "}
                Register as Both
              </button>
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
export default registerAsGuru;
