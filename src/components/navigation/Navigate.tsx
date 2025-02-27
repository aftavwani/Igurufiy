import React, { useState, useEffect, useContext } from "react";
import {
  IonButton,
  IonCol,
  IonLabel,
  IonRow,
  IonTabButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Link } from "react-router-dom";
import { IonFooter } from "@ionic/react";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  personOutline,
  starOutline,
  searchOutline,
  notificationsOutline,
  chatbubbleOutline,
} from "ionicons/icons";
import { NotifiContext } from "../../context/NotifiContext";

const Navigate: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const { notifiCount } = useContext(NotifiContext);

  return (
    <>
      {/* <div style={{ height: "80px" }}></div> */}
      {/* <div className="ion-fixed-bottom">Text</div> */}

      <IonFooter className="footer-tabs">
        <Link to={getUserData != null ? "/profile" : "/home"}>
          <IonButton fill="clear" className="navigate-btn">
            <IonIcon icon={homeOutline} />
          </IonButton>
        </Link>

        <Link to="/explore-gurus">
          <IonButton fill="clear" className="navigate-btn">
            <IonIcon icon={searchOutline} />
          </IonButton>
        </Link>

        <Link to={getUserData != null ? "/notification" : "/home"}>
          <div className="notify-icon">
            {getUserData != null &&
            notifiCount?.unread_notifications?.length > 0 ? (
              <IonText>{notifiCount?.unread_notifications?.length}</IonText>
            ) : (
              ""
            )}
            <IonButton fill="clear" className="navigate-btn">
              <IonIcon icon={notificationsOutline}></IonIcon>
            </IonButton>
          </div>
        </Link>

        <Link to="/home">
          <IonButton fill="clear" className="navigate-btn">
            <IonIcon icon={starOutline} />
          </IonButton>
        </Link>

        <Link to={getUserData != null ? "/message" : "/home"}>
          <div className="notify-icon">
            {notifiCount?.unread_messages?.length > 0 ? (
              <IonText>{notifiCount?.unread_messages?.length}</IonText>
            ) : (
              ""
            )}
            <IonButton fill="clear" className="navigate-btn">
              <IonIcon icon={chatbubbleOutline}></IonIcon>
            </IonButton>
          </div>
        </Link>

        <Link
          to={
            getUserData != null ? "/guru-detail/" + getUserData?.slug : "/home"
          }
        >
          <IonButton fill="clear" className="navigate-btn">
            <IonIcon icon={personOutline} />
          </IonButton>
        </Link>
      </IonFooter>
    </>
  );
};
export default Navigate;
