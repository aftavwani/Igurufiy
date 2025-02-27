import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonButton,
  IonLabel,
  IonInput,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/navigation/Header";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const RecommendBothGuru: React.FC = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      ig_userName: "",
      igGuruName: "",
      tiktok_userName: "",
      tiktokGuruName: "",
    },
  });
  /**
   *
   * @param data
   */

  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
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

  const onSubmitBoth = (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);

      const Url = process.env.API_SOME_KEY + "recomended-guru-to-add/add";
      axios
        .post(Url, {
          reg_type: "both",
          tiktok_username: data.tiktok_userName,
          tiktok_guru: data.tiktokGuruName,
          ig_username: data.ig_userName,
          ig_guru: data.igGuruName,
          email: data.email,
        })
        .then(function (response) {
          toast.success(response?.data?.msg, {
            duration: 8000,
          });
          setstartLoading(false);
          reset();
        })
        .catch(function (error) {
          console.log(error);
          toast.error(error?.data?.msg);
          setstartLoading(false);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const tiktokGuruClick = () => {
    reset();
  };

  const igGuruClick = () => {
    reset();
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
            <h1>Recomend Guru To Be Added</h1>
          </div>

          <div className="gurus-content">
            <p className="heading">Recomend Both Guru To Be Added</p>
            <div className="recomend-tabs">
              <Link
                onClick={igGuruClick}
                className="link"
                to="/recomend-instagram-guru"
              >
                <div className="link ">
                  Recommend
                  <br /> IG Guru to be <br /> Added
                </div>
              </Link>
              <Link
                onClick={tiktokGuruClick}
                className="link"
                to="/recomend-tiktok-guru"
              >
                <div className="link ">
                  {" "}
                  Recommend <br />
                  TikTok Guru <br />
                  to be Added
                </div>
              </Link>
              <Link className="active link" to="/recomend-both-guru">
                <div className="link ">
                  Recomend <br /> IG/TikTok <br />
                  Guru to be <br />
                  Added
                </div>
              </Link>
            </div>
            {/* <div>{errorMsg}</div> */}

            <form onSubmit={handleSubmit(onSubmitBoth)}>
              <IonLabel color="light">Your Instagram User Name</IonLabel>
              <IonInput
                {...register("ig_userName", {
                  required: "Instagram User Name is a required",
                })}
                placeholder="Instagram Username"
                className="custom"
                name="ig_userName"
              />
              <ErrorMessage
                errors={errors}
                name="ig_userName"
                as={<div className="error" />}
              />

              <IonLabel color="light">
                Instagram Guru to be added to IGurufy to leave Review
              </IonLabel>
              <IonInput
                {...register("igGuruName", {
                  required: "Instagram Guru User Name is a required",
                })}
                placeholder="Guru Username"
                className="custom"
                name="igGuruName"
              />
              <ErrorMessage
                errors={errors}
                name="igGuruName"
                as={<div className="error" />}
              />

              <IonLabel color="light">Your TikTok User Name</IonLabel>
              <IonInput
                {...register("tiktok_userName", {
                  required: "TikTok User Name is a required",
                })}
                placeholder="TikTok Username"
                className="custom"
                name="tiktok_userName"
              />
              <ErrorMessage
                errors={errors}
                name="tiktok_userName"
                as={<div className="error" />}
              />

              <IonLabel color="light">
                TikTok Guru to be added to IGurufy to leave Review
              </IonLabel>
              <IonInput
                {...register("tiktokGuruName", {
                  required: "TikTok Guru User Name is a required",
                })}
                placeholder="Guru Username"
                className="custom"
                name="tiktokGuruName"
              />
              <ErrorMessage
                errors={errors}
                name="tiktokGuruName"
                as={<div className="error" />}
              />

              <IonLabel color="light">
                Your Email Address to be notified when Guru is Added
              </IonLabel>
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

              <IonButton
                type="submit"
                expand="block"
                className="submit button-inner"
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
export default RecommendBothGuru;
