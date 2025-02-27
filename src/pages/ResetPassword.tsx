import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/react";
import Navigate from "../components/navigation/Navigate";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import Header from "../components/navigation/Header";
import UserMenu from "../components/menu/UserMenu";
import { NotifiContext } from "../context/NotifiContext";

const ResetPassword: React.FC = () => {
  const histroy = useHistory();
  const Url = process.env.API_SOME_KEY + "reset-password/";
  let emailData = localStorage.getItem("userEmail");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const { setNotifiCount } = useContext(NotifiContext);

  //_____  SHOW AND HIDE CONFIRM PASSWORD START  _____//
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
  //_____  SHOW AND HIDE CONFIRM PASSWORD END  _____//

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
      newPassword: "",
      passwordConfirmation: "",
    },
  });
  /**
   *
   * @param data
   */

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

  //   useIonViewWillEnter(() => {
  //     if (emailData === null) {
  //       histroy.push("/forget-password");
  //     }else{
  //     setTimeout(() => {
  //         localStorage.removeItem("userEmail");
  //         histroy.push("/forget-password");
  //     }, 60000);
  //   }
  //   });

  const submitBtn = (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      axios
        .post(Url, {
          password: data.newPassword,
          password_confirmation: data.passwordConfirmation,
          email: emailData,
        })
        .then(function (response) {
          setstartLoading(false);
          toast.success(response?.data?.message);
          localStorage.removeItem("userEmail");
          reset();
          histroy.push("/login");
        })
        .catch(function (error) {
          setstartLoading(false);
          console.log(error);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  return (
    <>
      <UserMenu />
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonPage id="main-content" className="bg-color">
        <Header />
        {/* <IonHeader>
          <IonToolbar>
            <IonTitle>
              <IonHeader className="ion-text-center header login-main-header">
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
              </IonHeader>
            </IonTitle>
          </IonToolbar>
        </IonHeader> */}
        <IonContent fullscreen className="top-section">
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
                <IonLabel color="light">New Password</IonLabel>
                <IonInput
                  {...register("newPassword", {
                    required: "New Password is a required field",
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
export default ResetPassword;
