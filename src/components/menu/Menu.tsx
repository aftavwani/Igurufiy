import React, { useEffect } from "react";
// import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonText,
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import {
  homeOutline,
  logInOutline,
  personAddOutline,
  personCircleOutline,
  personOutline,
  pencilSharp,
  callOutline,
} from "ionicons/icons";
import { NavLink } from "react-router-dom";

const Menu: React.FC = () => {
  const menuRef = React.useRef<HTMLIonMenuElement>(null);

  const handleToggle = () => {
    menuRef.current?.close();
  };

  return (
    <>
      <IonMenu ref={menuRef} contentId="main-content">
        <IonContent className="ion-padding ion-menu">
          <IonHeader>
            <IonToolbar className="menuCloseContainer">
              <IonMenuToggle className="toggel">
                <img
                  src={imageIndexing?.arrowMenu}
                  alt={imageIndexing?.arrowMenu}
                />
              </IonMenuToggle>
            </IonToolbar>
          </IonHeader>

          <div className="sidebar-menu">
            <div>
              <img src={imageIndexing.logo} alt={imageIndexing.logo} />
            </div>

            <IonText className="ion-text-center">
              Igurufy is an online platform to rate & Review Guru aroung the
              world.
            </IonText>

            <IonList lines="none">
              <NavLink to="/home" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={homeOutline}></IonIcon>
                  <IonLabel>Home</IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/explore-gurus" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={personOutline}></IonIcon>
                  <IonLabel>Gurus</IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/contact" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={callOutline}></IonIcon>
                  <IonLabel>Contact</IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/claim-guru-profile" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={personCircleOutline}></IonIcon>
                  <IonLabel>Claim Guru Profile</IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/recomend-instagram-guru" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                  <IonLabel>
                    Recomented Guru
                    <br />
                    Profile to be added
                  </IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/login" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={logInOutline}></IonIcon>
                  <IonLabel>Log In</IonLabel>
                </IonItem>
              </NavLink>
              <NavLink to="/register" className="menu-link">
                <IonItem className="menu" onClick={handleToggle}>
                  <IonIcon slot="start" icon={pencilSharp}></IonIcon>
                  <IonLabel>Sign Up</IonLabel>
                </IonItem>
              </NavLink>
            </IonList>
          </div>
        </IonContent>
      </IonMenu>
    </>
  );
};
export default Menu;
