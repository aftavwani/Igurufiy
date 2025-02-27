import React, { useState, useEffect } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonLabel,
  IonButton,
  IonText,
  useIonViewWillEnter,
  IonIcon,
  IonHeader,
  useIonToast 
} from "@ionic/react";
import { arrowBackCircle } from "ionicons/icons";
import { NavLink, Link } from "react-router-dom";
import imageIndexing from "./../assets/images/imageIndexing";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import OtpInput from "react-otp-input";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import { useTimer } from "react-timer-hook";

function OtpCountDownTimer({ expiryTimestamp }: any) {
  const histroy = useHistory();
  const { seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      localStorage.removeItem("OTP");
      histroy.push("/forget-password");
    },
  });

  return (
    <div>
      <span>{seconds}</span>
    </div>
  );
}

const PasswordOtp: React.FC = () => {
  const histroy = useHistory();
  const [presentToast] = useIonToast(); 
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });
  /**
   *
   * @param data
   */

  const [otpData, setotpData] = useState("");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const otp = localStorage.getItem("OTP");

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

  // useIonViewWillEnter(() => {
  //   if (otp === null) {
  //     histroy.push("/forget-password");
  //   }
  // });

  const submitBtn = () => {
    if (checkNetwok !== false) {
      if (otpData !== "") {
        if (otp === otpData) {
          setotpData("");
          histroy.push("/reset-password");
          localStorage.removeItem("OTP");
        } else {
          toast.error("OTP not match");
        }
      } else {
        toast.error("Please Enter the OTP");
        // presentToast({
        //   message: 'Hello World!',
        //   duration: 1500,
        //   position: "bottom",
        //   color: "commentToast"
        // });
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const handleBack = () => {
    localStorage.removeItem("OTP");
    histroy.push("/forget-password");
  };

  const time = new Date();
  time.setSeconds(time.getSeconds() + 60);

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonPage>
        <IonContent fullscreen className="main">
          <IonHeader className="ion-text-center login-main-header">
            <IonIcon
              className="back-icon"
              icon={arrowBackCircle}
              size="large"
              onClick={handleBack}
            ></IonIcon>

            <img src={imageIndexing.logo} />
          </IonHeader>
          <div className="content cstm-otp content-sec">
            <IonText className="ion-text-center">
              <h4 className="adasdsf">Verification</h4>
              <div>You will get OTP via E-mail</div>
            </IonText>
            <form onSubmit={handleSubmit(submitBtn)}>
              <IonLabel color="light">Otp</IonLabel>
              <OtpInput
                value={otpData}
                onChange={setotpData}
                numInputs={4}
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}
              />
              <OtpCountDownTimer expiryTimestamp={time} />
              <IonButton expand="block" type="submit" className="button-inner">
                Submit
              </IonButton>
            </form>

            <IonText
              className="ion-text-center bottom-link bottom-txt"
              color="light"
            >
              <div className="">
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
export default PasswordOtp;
