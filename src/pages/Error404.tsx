import React from "react";
import "./../assets/css/StyleSheet.css";
import { IonContent, IonPage, IonButton, IonText } from "@ionic/react";
import { Link } from "react-router-dom";

const Error404: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <IonPage id="main-content">
        <IonContent fullscreen className="ion-padding main">
          <div className="content content-sec">
            <IonText className="ion-text-center" style={{ fontSize: "60px" }}>
              404
            </IonText>
            <IonText className="ion-text-center" style={{ marginTop: "-64px" }}>
              Opps! Page not found.
            </IonText>
            <IonText
              className="ion-text-center"
              style={{ marginTop: "-25px", fontSize: "20px" }}
            >
              The page you're looking for doesn't exist.
            </IonText>
          </div>
          <Link className="register-link welcome-link" to={getUserData !== null ? "/home" : "/index"}>
            <IonButton expand="block" className="button-inner">
              Back To Home
            </IonButton>
          </Link>
        </IonContent>
      </IonPage>
    </>
  );
};
export default Error404;
