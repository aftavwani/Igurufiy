import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import Header from "../components/navigation/Header";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const ResetYourPassword: React.FC = () => {
  //_____  SHOW AND HIDE CONFIRM PASSWORD START  _____//
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
  //_____  SHOW AND HIDE CONFIRM PASSWORD END  _____//

  //_____  SHOW AND HIDE NEW PASSWORD START  _____//
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
  //_____  SHOW AND HIDE NEW PASSWORD END  _____//

  //_____  SHOW AND HIDE CONFIRM PASSWORD START  _____//
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
  //_____  SHOW AND HIDE CONFIRM PASSWORD END  _____//

  const {
    handleSubmit,
    register,
    reset,
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

  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const { setNotifiCount } = useContext(NotifiContext);

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

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      reset();
      if (checkNetwok === false) {
        settoastMessage("Sorry, something went wrong!");
        settoastOpen(true);
      } else {
        axiosData();
      }
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    logCurrentNetworkStatus();
    if (checkNetwok === false) {
      settoastMessage("Sorry, something went wrong!");
    } else {
      axiosData();
    }
  }, []);

  const axiosData = () => {
    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  const submitBtn = (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const Url = process.env.API_SOME_KEY + "change-password/";

      axios
        .post(Url, {
          current_password: data.currentPassword,
          password: data.newPassword,
          confirm_password: data.passwordConfirmation,
          email: getUserData?.email,
        })
        .then(function (response) {
          toast.success(response?.data?.message);
          reset();
          setstartLoading(false);
        })
        .catch(function (error) {
          toast.error(error?.response?.data?.message);
          setstartLoading(false);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
          <IonRefresher
            slot="fixed"
            pullFactor={0.5}
            pullMin={100}
            pullMax={200}
            onIonRefresh={handleRefresh}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="banner-img">
            <h1>Create Your New Password</h1>
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
                    required: "Current Password is a required",
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
                    required: "New Password is a required",
                  })}
                  placeholder="New Password"
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
                    required: "Confirm Password is a required",
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
                className="button-inner"
                type="submit"
              >
                Submit
              </IonButton>
            </form>
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

        {/* Footer Navigate bars components */}
        <Navigate />
      </IonPage>
    </>
  );
};
export default ResetYourPassword;
