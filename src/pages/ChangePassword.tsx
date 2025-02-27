import React, { useState } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonThumbnail,
  IonMenuButton,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { NavLink } from "react-router-dom";

const ChangePassword: React.FC = () => {
  //_____  SHOW AND HIDE PASSSWORD START  _____//
  const [currentPasswordEye, setcurrentPasswordEye] = useState(eyeOutline);
  const [currentPasswordType, setcurrentPasswordType] = useState("password");

  const currentEyeToggle = () => {
    if (currentPasswordEye == eyeOutline && currentPasswordType == "password") {
      setcurrentPasswordEye(eyeOffOutline);
      setcurrentPasswordType("text");
    }

    if (currentPasswordEye == eyeOffOutline && currentPasswordType == "text") {
      setcurrentPasswordEye(eyeOutline);
      setcurrentPasswordType("password");
    }
  };
  //_____  SHOW AND HIDE PASSSWORD END  _____//

  //_____  SHOW AND HIDE CONFIRM PASSSWORD START  _____//
  const [newPasswordEye, setnewPasswordEye] = useState(eyeOutline);
  const [newPasswordType, setnewPasswordType] = useState("password");

  const newEyeToggle = () => {
    if (newPasswordEye == eyeOutline && newPasswordType == "password") {
      setnewPasswordEye(eyeOffOutline);
      setnewPasswordType("text");
    }

    if (newPasswordEye == eyeOffOutline && newPasswordType == "text") {
      setnewPasswordEye(eyeOutline);
      setnewPasswordType("password");
    }
  };
  //_____  SHOW AND HIDE CONFIRM PASSSWORD END  _____//

  //_____  SHOW AND HIDE CONFIRM PASSSWORD START  _____//
  const [cPasswordEye, setcPasswordEye] = useState(eyeOutline);
  const [cPasswordType, setcPasswordType] = useState("password");

  const cEyeToggle = () => {
    if (cPasswordEye == eyeOutline && cPasswordType == "password") {
      setcPasswordEye(eyeOffOutline);
      setcPasswordType("text");
    }

    if (cPasswordEye == eyeOffOutline && cPasswordType == "text") {
      setcPasswordEye(eyeOutline);
      setcPasswordType("password");
    }
  };
  //_____  SHOW AND HIDE CONFIRM PASSSWORD END  _____//

  const {
    handleSubmit,
    register,
    // getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });
  /**
   *
   * @param data
   */

  const submitBtn = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <div className="header">
                <IonMenuButton className="user-menu-toogle"></IonMenuButton>
                <img
                  src={imageIndexing.logo}
                  alt={imageIndexing.logo}
                  width="50%"
                />
                <IonThumbnail className="user-nav-avtar">
                  <img
                    alt={imageIndexing.avtar}
                    src={imageIndexing.avtar}
                    style={{ float: "right" }}
                  />
                </IonThumbnail>
              </div>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="top-section">
          <div className="banner-img">
            <h1>Claim Guru Profile</h1>
          </div>

          <div className="inner-content registration">
            <form
              onSubmit={handleSubmit(submitBtn)}
              encType="multipart/form-data"
              id="create-course-form"
            >
              <div className="password">
                <IonLabel color="light">Current Password</IonLabel>
                <IonInput
                  {...register("currentPassword", {
                    required: "Current Password is a required field",
                  })}
                  placeholder="Current Password"
                  className="custom"
                  name="currentPassword"
                  type={currentPasswordType}
                />
                <IonIcon
                  onClick={currentEyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={currentPasswordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="currentPassword"
                as={<div className="error" />}
              />

              <div className="password">
                <IonLabel color="light">New Password</IonLabel>
                <IonInput
                  {...register("newPassword", {
                    required: "Current Password is a required field",
                  })}
                  placeholder="Current Password"
                  className="custom"
                  name="newPassword"
                  type={newPasswordType}
                />
                <IonIcon
                  onClick={newEyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={newPasswordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="newPassword"
                as={<div className="error" />}
              />

              <div className="password">
                <IonLabel color="light">Confirm Password</IonLabel>
                <IonInput
                  {...register("passwordConfirmation", {
                    required: "Current Password is a required field",
                  })}
                  placeholder="Confirm Password"
                  className="custom"
                  name="passwordConfirmation"
                  type={cPasswordType}
                />
                <IonIcon
                  onClick={cEyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={cPasswordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="passwordConfirmation"
                as={<div className="error" />}
              />

              <IonButton
                id="present-alert"
                // expand="block"
                className="button-inner"
                type="submit"
              >
                Submit
              </IonButton>
            </form>

            {/* Footer Navigate bars components */}
            <Navigate />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};
export default ChangePassword;
