import React, { useRef, useContext, useEffect, useState } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonText,
  IonList,
  IonLabel,
  IonItem,
  IonIcon,
  IonThumbnail,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import {
  lockClosedOutline,
  logOutOutline,
  settingsOutline,
  personCircleOutline,
  personOutline,
  callOutline,
  notificationsOutline,
  createOutline,
  personAddOutline,
  checkmarkCircle,
} from "ionicons/icons";
import { NavLink, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../AuthedContext";
import Menu from "./Menu";
import axios from "axios";

const UserMenu: React.FC = () => {
  const history = useHistory();
  const menuRef = React.useRef<HTMLIonMenuElement>(null);
  let context = useContext(AuthContext);
  const getUserData = JSON.parse(localStorage.getItem("userData"));

  const handleToggle = () => {
    menuRef.current?.close();
  };

  const logOutBtn = async () => {
    const Url = process.env.API_SOME_KEY + "data/";
    await axios
      .post(Url, {
        id: getUserData?.id,
        log_status: 0,
      })
      .then(function (response) {
        console.log(response?.data);

        localStorage.removeItem("userData");
        localStorage.setItem("isLogged", JSON.stringify(false));
        context.isAuthenticated = false;
        menuRef.current?.close();
        history.push("/index");
      })
      .catch(function (error) {
        console.log(error?.response?.data);
      });
  };

  return (
    <>
      {getUserData !== null ? (
        <IonMenu
          ref={menuRef}
          onIonDidClose={handleToggle}
          contentId="main-content"
        >
          <IonContent className="ion-padding">
            <IonHeader>
              <IonToolbar className="menuCloseContainer">
                <IonMenuToggle className="toggel">
                  <img
                    src={imageIndexing.arrowMenu}
                    alt={imageIndexing.arrowMenu}
                  />
                </IonMenuToggle>
              </IonToolbar>
            </IonHeader>

            {getUserData !== null ? (
              <Link
                onClick={handleToggle}
                to={"/guru-detail/" + getUserData?.slug}
              >
                <IonThumbnail className="user-sideMenu-avtar">
                  <img
                    alt={
                      "https://igurufy.com/storage/app/public/" +
                      getUserData?.avatar
                    }
                    src={
                      "https://igurufy.com/storage/app/public/" +
                      getUserData?.avatar
                    }
                  />
                </IonThumbnail>
              </Link>
            ) : (
              ""
            )}

            <IonText className="ion-text-center">
              <h5>
                {getUserData !== null ? getUserData?.name : ""}

                {getUserData !== null && getUserData?.role_id !== 4 ? (
                  <IonIcon
                    icon={checkmarkCircle}
                    className="name-check-mark"
                  ></IonIcon>
                ) : (
                  ""
                )}
              </h5>
              <p>{getUserData !== null ? getUserData?.email : ""}</p>
            </IonText>

            <div>
              <IonList lines="none">
                <NavLink to="/explore-gurus" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={personOutline}></IonIcon>
                    <IonLabel>Gurus</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/recomend-instagram-guru" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                    <IonLabel>Recomened Guru</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/claim-guru-profile" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={personCircleOutline}></IonIcon>
                    <IonLabel>Claim Guru Profile</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/contact" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={callOutline}></IonIcon>
                    <IonLabel>Contact</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/notification" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={notificationsOutline}></IonIcon>
                    <IonLabel>Notification</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/edit-profile" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={createOutline}></IonIcon>
                    <IonLabel>Edit Profile</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/reset-your-password" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={lockClosedOutline}></IonIcon>
                    <IonLabel>Password</IonLabel>
                  </IonItem>
                </NavLink>

                <NavLink to="/account-setting" className="menu-link">
                  <IonItem className="menu" onClick={handleToggle}>
                    <IonIcon slot="start" icon={settingsOutline}></IonIcon>
                    <IonLabel>Setting</IonLabel>
                  </IonItem>
                </NavLink>

                {/* <NavLink to="/" className="menu-link"> */}
                <IonItem className="menu" onClick={logOutBtn}>
                  <IonIcon slot="start" icon={logOutOutline}></IonIcon>
                  <IonLabel>Log Out</IonLabel>
                </IonItem>
                {/* </NavLink> */}
              </IonList>
            </div>
          </IonContent>
        </IonMenu>
      ) : (
        <Menu />
      )}
    </>
  );
};
export default UserMenu;
