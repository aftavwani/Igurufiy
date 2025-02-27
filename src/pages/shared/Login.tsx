import React, { useState, useContext, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonText,
  IonIcon,
  useIonViewWillEnter,
  useIonToast,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import { NavLink, Link } from "react-router-dom";
import imageIndexing from "./../../assets/images/imageIndexing";
import { eyeOutline, eyeOffOutline, arrowBackCircle } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../../AuthedContext";
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";

const Login: React.FC = () => {
  const context = useContext(AuthContext);
  const history = useHistory();
  const [presentToast] = useIonToast();

  //_____  SHOW AND HIDE PASSSWORD START  _____//
  const [passwordEye, setpasswordEye] = useState(eyeOutline);
  const [passwordType, setpasswordType] = useState("password");

  const eyeToggle = () => {
    if (passwordEye == eyeOutline && passwordType == "password") {
      setpasswordEye(eyeOffOutline);
      setpasswordType("text");
    }

    if (passwordEye == eyeOffOutline && passwordType == "text") {
      setpasswordEye(eyeOutline);
      setpasswordType("password");
    }
  };
  //_____  SHOW AND HIDE PASSSWORD END  _____//

  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const getRememberData = JSON.parse(localStorage.getItem("rememberData"));

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: getRememberData?.email,
      password: getRememberData?.password,
      rememberMe: getRememberData?.rememberMe,
    },
  });
  /**
   *
   * @param data
   */

  const [checkBoxData, setcheckBoxData] = useState(Boolean);
  const handleRemember = (e: any) => {
    setcheckBoxData(e.target.checked);
  };

  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);

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

  useIonViewWillEnter(() => {
    if (getUserData !== null) {
      history.push("/home");
    }
  });

  useEffect(() => {
    if (getUserData !== null) {
      history.push("/home");
    }
    logCurrentNetworkStatus();
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    } else {
      if (getRememberData !== null) {
        setcheckBoxData(true);
      } else {
        setcheckBoxData(false);
      }
    }
  }, []);

  const [tokenData, settokenData] = useState('')
  const loginSub = async (data: any) => {
    if (checkNetwok === true) {
      setstartLoading(true);

      const Url = process.env.API_SOME_KEY + "data/";
      await axios
        .post(Url, {
          email: data.email,
          password: data.password,
          log_status: 1,
        })
        .then(function (response) {
          PushNotifications.checkPermissions().then((res: any) => {
            if (res.receive !== "granted") {
              PushNotifications.requestPermissions().then((res: any) => {
                //do something
              });
            } else {
              //do something
            }
          });

          toast.success(response?.data?.message);
          // if (response?.data?.data?.fcm_token == null) {
          // PushNotifications.register();
          // PushNotifications.addListener("registration", (token: Token) => {
          //   const Url = process.env.API_SOME_KEY + "update-fcm/";
          //   settokenData(token.value)

          //   axios
          //     .post(Url, {
          //       fcm_token: token?.value,
          //       user_id: response?.data?.data?.id,
          //     })
          //     .then(function (response) {})
          //     .catch(function (error) {});
          // });
          // }
          localStorage.setItem(
            "userData",
            JSON.stringify(response?.data?.data)
          );
          localStorage.setItem("isLogged", JSON.stringify(true));
          context.isAuthenticated = true;
          if (checkBoxData === true) {
            localStorage.setItem("rememberData", JSON.stringify(data));
          } else {
            localStorage.removeItem("rememberData");
            reset();
          }
          setstartLoading(false);
          history.push("/home");
        })
        .catch(function (error) {
          setstartLoading(false);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastOpen(true);
      settoastMessage("No Internet Connection!");
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
            <NavLink to="/index">
              <IonIcon
                className="back-icon"
                icon={arrowBackCircle}
                size="large"
              ></IonIcon>
            </NavLink>

            <Link to="/index">
              <img src={imageIndexing.logo} alt={imageIndexing.logo} />
            </Link>
          </IonHeader>
          <div className="content content-sec">
            <IonText className="ion-text-center">
              <h4 className="adasdsf">Sign in</h4>
              <div>From all over the world test</div>
            </IonText>
            <form onSubmit={handleSubmit(loginSub)}>
              <IonLabel color="light">Email Address</IonLabel>
              <IonInput
                {...register("email", {
                  required: "Email is a required field",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "invalid email address",
                  },
                })}
                placeholder="Email"
                className="custom"
                name="email"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                as={<div className="error" />}
              />

              <div className="password">
                <IonLabel color="light">Password</IonLabel>
                <IonInput
                  {...register("password", {
                    required: "Password is a required",
                  })}
                  placeholder="password"
                  className="custom"
                  name="password"
                  type={passwordType}
                />
                <IonIcon
                  onClick={eyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={passwordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="password"
                as={<div className="error" />}
              />

              <div className="ion-color-light">
                <IonCheckbox
                  {...register("rememberMe")}
                  onIonChange={handleRemember}
                  className="remember-checkbox"
                  labelPlacement="end"
                  name="rememberMe"
                  checked={checkBoxData}
                >
                  <IonText color="light">Remember me</IonText>
                </IonCheckbox>

                <IonText className="ion-float-right login-remember">
                  <NavLink
                    className="forgot-pass-signup-font"
                    to="/forget-password"
                  >
                    Forgot Password
                  </NavLink>
                </IonText>
              </div>
              <IonButton type="submit" expand="block" className="button-inner">
                Log In
              </IonButton>
            </form>

            <IonText className="ion-text-center bottom-txt" color="light">
              <div>
                Don't have an Account?{" "}
                <NavLink
                  className="forgot-pass-signup-font register-link"
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
export default Login;
