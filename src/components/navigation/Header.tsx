import React from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonThumbnail,
  IonMenuButton,
  IonButtons,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="header">
              <IonButtons slot="start">
                <IonMenuButton className="user-menu-toogle"></IonMenuButton>
              </IonButtons>
              <Link to="/home" className="logo-header">
                <img
                  src={imageIndexing.logo}
                  alt={imageIndexing.logo}
                  width="50%"
                />
              </Link>
              <IonThumbnail className="user-nav-avtar">
                {getUserData !== null ? (
                  <Link to={"/guru-detail/" + getUserData?.slug}>
                    <img
                      alt={
                        "https://igurufy.com/storage/app/public/" +
                        getUserData?.avatar
                      }
                      src={
                        "https://igurufy.com/storage/app/public/" +
                        getUserData?.avatar
                      }
                      className="header-avtar"
                    />
                  </Link>
                ) : (
                  ""
                )}
              </IonThumbnail>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};
export default Header;
