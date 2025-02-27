import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonText,
  IonInput,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
  useIonViewWillLeave,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { paperPlane, call, mail } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Header from "../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const Contact: React.FC = () => {
  const histroy = useHistory();
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [stateData, setstateData] = useState({});
  const getUserData = JSON.parse(localStorage.getItem("userData"));
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
      // Any calls to load data go here
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
  }, []); // Added checkNetwork to the dependency array

  const axiosData = async () => {
    setstartLoading(true); // Indicate loading state

    try {
      const response = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(response?.data?.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      settoastMessage("Failed to fetch profile data.");
    } finally {
      setstartLoading(false); // Reset loading state
    }
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      lname: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  /**
   *
   * @param data
   */

  useIonViewWillLeave(() => {
    reset();
  });

  const submitBtn = (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const Url = process.env.API_SOME_KEY + "contactemail/";

      axios
        .post(Url, {
          name: data.name,
          lname: data.lname,
          email: data.email,
          phone: data.phone,
          message: data.message,
        })
        .then(function (response) {
          console.log(response);
          toast.success(response?.data?.message);
          reset();
          setstartLoading(false);
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
            <h1>Contact Us</h1>
          </div>
          <div className="inner-content">
            <h4>Keep in Touch with Us</h4>
            <form onSubmit={handleSubmit(submitBtn)}>
              <IonLabel color="light">First Name</IonLabel>
              <IonInput
                {...register("name", {
                  required: "Name is a required",
                })}
                placeholder="Your First Name"
                className="custom"
                name="name"
              />
              <ErrorMessage
                errors={errors}
                name="name"
                as={<div className="error" />}
              />

              <IonLabel color="light">Last name</IonLabel>
              <IonInput
                {...register("lname", {
                  required: "Last Name is a required",
                })}
                placeholder="Your Last Name"
                className="custom"
                name="lname"
              />
              <ErrorMessage
                errors={errors}
                name="lname"
                as={<div className="error" />}
              />

              <IonLabel color="light">Email Address</IonLabel>
              <IonInput
                {...register("email", {
                  required: "Email is a required",
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

              <IonLabel color="light">Mobile Number</IonLabel>
              <IonInput
                {...register("phone", {
                  required: "Mobile Number is a required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter valid number",
                  },
                })}
                placeholder="Your Mobile Number"
                className="custom"
                name="phone"
                type="tel"
              />
              <ErrorMessage
                errors={errors}
                name="phone"
                as={<div className="error" />}
              />

              <IonLabel color="light">Your Message</IonLabel>
              <IonTextarea
                {...register("message", {
                  required: "Message is a required",
                })}
                aria-label="yourMessage"
                placeholder="Message"
                className="contact-message"
                name="message"
              />
              <ErrorMessage
                errors={errors}
                name="message"
                as={<div className="error" />}
              />

              <IonButton
                type="submit"
                className="button-inner contact-btn"
                expand="block"
              >
                Submit
                <IonIcon
                  style={{ color: "#000", fontSize: "15px" }}
                  slot="end"
                  icon={paperPlane}
                ></IonIcon>
              </IonButton>
            </form>
            <div className="contact-info-box">
              <IonText color="dark" className="ion-text-center">
                <h3>Contact Information</h3>
              </IonText>
              <IonText color="dark" className="ion-text-center">
                <p>The standard chank of Lorem Ipsum used since the 1500s</p>
              </IonText>

              <div className="box">
                <div className="icon-box">
                  <IonIcon className="icon" icon={call}></IonIcon>
                </div>

                <IonText color="dark">
                  <p>+0123456789</p>
                </IonText>
              </div>

              <div className="box">
                <div className="icon-box">
                  <IonIcon className="icon" icon={mail}></IonIcon>
                </div>
                <IonText>
                  <p>Email@sample.com</p>
                </IonText>
              </div>
            </div>
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
export default Contact;
