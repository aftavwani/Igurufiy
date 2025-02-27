import React, { useState, useEffect } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonButton,
  IonText,
  IonIcon,
  IonHeader,
} from "@ionic/react";
import { arrowBackCircle } from "ionicons/icons";
import { NavLink, Link } from "react-router-dom";
import imageIndexing from "./../assets/images/imageIndexing";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";

const ForgotPassword: React.FC = () => {
  const histroy = useHistory();
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const Url = process.env.API_SOME_KEY + "forget-password/";

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

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  /**
   *
   * @param data
   */

  const submitBtn = (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);

      axios
        .post(Url, {
          email: data?.email,
        })
        .then(function (response) {
          localStorage.setItem("OTP", JSON.stringify(response?.data?.data));
          localStorage.setItem("userEmail", data.email);
          toast.success(response?.data?.message);
          reset();
          setstartLoading(false);
          histroy.push("./otp");
        })
        .catch(function (error) {
          console.log(error);
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
      <IonPage>
        <IonContent fullscreen className="main">
          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <IonHeader className="ion-text-center login-main-header">
            <Link to="/login">
              <IonIcon
                className="back-icon"
                icon={arrowBackCircle}
                size="large"
              ></IonIcon>
            </Link>

            <img src={imageIndexing.logo} />
          </IonHeader>
          <div className="content content-sec">
            <IonText className="ion-text-center">
              <h4 className="adasdsf">Reset Your Password</h4>
            </IonText>
            <form onSubmit={handleSubmit(submitBtn)}>
              <IonLabel color="light">Email Address</IonLabel>
              <IonInput
                {...register("email", {
                  required: "Email is a required field",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "invalid email address",
                  },
                })}
                placeholder="Your Email"
                className="custom"
                name="email"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                as={<div className="error" />}
              />

              <IonButton expand="block" type="submit" className="button-inner">
                Submit
              </IonButton>
            </form>

            <IonText className="ion-text-center bottom-txt" color="light">
              <div>
                Don't have an Account?{" "}
                <NavLink
                  className="forgot-pass-signup-font  register-link"
                  to="/register"
                >
                  Signup
                </NavLink>
              </div>
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
    </>
  );
};
export default ForgotPassword;
