import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  useIonViewWillEnter,
  IonIcon,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import DetailGrurCompo from "../components/DetailGuruCompo";
import axios from "axios";
import Header from "../components/navigation/Header";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import ViewsFormat from "../components/ViewsFormat";
import SocialIcon from "../components/SocialIcon";
import ImageExpandCompo from "../components/ImageExpandCompo";
import { checkmarkCircle } from "ionicons/icons";
import { NotifiContext } from "../context/NotifiContext";

const AddMessage: React.FC = () => {
  const history = useHistory();
  const params = useParams();
  const nameParam = params.name;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [imageStyle, setimageStyle] = useState("");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [totalFollower, settotalFollower] = useState([]);
  const Url = process.env.API_SOME_KEY + "explore-guru/" + nameParam;
  const [guruData, setguruData] = useState({
    avatar: "",
    slug: "",
    ig_username: "",
    tiktok_username: "",
    total_profile_reviews: "",
    profile_views: "",
    totalfollower: "",
    totalfollowing: "",
    posts: "",
    name: "",
    reviews: "",
    usermeta: "",
    id: "",
    role_id: 0,
    login_status: 0,
    fcm_token: "",
  });
  const [ViewsCount, setViewsCount] = useState(0);
  const [followerCount, setfollowerCount] = useState({
    totalfollower: "",
    totalfollowing: "",
  });
  const [metaUserData, setmetaUserData] = useState({});
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
      if (checkNetwok !== false) {
        axiosData();
        reset();
      } else {
        settoastMessage("Sorry, something went wrong!");
        settoastOpen(true);
      }
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, [nameParam]); // Added checkNetwork to dependencies

  const axiosData = async () => {
    setstartLoading(true);

    try {
      const response = await axios.get(Url);
      const guru = response?.data?.data?.guru;

      setguruData(guru);
      setViewsCount(guru?.profile_views?.length);
      setmetaUserData(guru?.usermeta);
      setfollowerCount({
        totalFollower: guru?.totalfollower,
        totalFollowing: guru?.totalfollowing,
      });
      settotalFollower(guru?.totalfollower);

      if (guru?.usermeta?.profile_cover) {
        setimageStyle(
          `https://igurufy.com/storage/app/public/${guru.usermeta.profile_cover}`
        );
      } else {
        setimageStyle(imageIndexing.defaultBanner);
      }
    } catch (error) {
      console.error("Error fetching guru data:", error?.response);
      settoastMessage("Failed to fetch guru data.");
    } finally {
      setstartLoading(false);
    }

    try {
      const profileResponse = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(profileResponse?.data?.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      settoastMessage("Failed to fetch profile data.");
    }
  };

  useIonViewWillEnter(() => {
    axios.get(Url).then(function (response) {
      setViewsCount(response?.data?.data?.guru?.profile_views?.length);
      setfollowerCount({
        totalfollower: response?.data?.data?.guru?.totalfollower,
        totalfollowing: response?.data?.data?.guru?.totalfollowing,
      });
    });
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      subject: "",
      message: "",
    },
  });
  /**
   *
   * @param data
   */

  const addMsgUrl = `${process.env.API_SOME_KEY}explore-gurus/${nameParam}/bp-messages/new-message/send`;
  const submitBtn = (data: any) => {
    setstartLoading(true);
    if (checkNetwok !== false) {
      axios
        .post(addMsgUrl, {
          subject: data.subject,
          message: data.message,
          username: nameParam === getUserData?.slug ? data.username : nameParam,
          sender_id: getUserData?.id,
          fcm_token: guruData?.fcm_token,
          receiver_id: guruData?.id,
        })
        .then(function (response) {
          reset();
          setstartLoading(false);
          toast.success(response?.data?.message);
        })
        .catch(function (error) {
          setstartLoading(false);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const [imageIsOpen, setimageIsOpen] = useState(false);
  const handleImageExpand = () => {
    setimageIsOpen(true);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="guru-detail-bg">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section guru-detail-info info">
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

          <div
            className="guru-detail-banner"
            style={{ background: `url(${imageStyle}) no-repeat center/cover` }}
          ></div>
          <div className="gurus-profile addmessage gurus-profile-form">
            <div className="avtar-info main-sec-content">
              <div className="avtar-img info-avtar-img">
                <img
                  src={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  alt={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  width="50%"
                  onClick={handleImageExpand}
                />
                <p>{guruData?.login_status === 1 ? "Online" : "Offline"}</p>
              </div>
              <div className="avtar-cntnt">
                <h2>
                  @
                  {guruData.ig_username != null
                    ? guruData.ig_username
                    : guruData.tiktok_username}
                  {guruData?.role_id !== 4 ? (
                    <IonIcon
                      icon={checkmarkCircle}
                      className="name-check-mark"
                    ></IonIcon>
                  ) : (
                    ""
                  )}
                </h2>
                <p>{guruData.name}</p>

                {/* Star Rating And Rating Length Component */}
                <Rating
                  rating={guruData?.total_profile_reviews}
                  ratingText={true}
                />
              </div>
              {/* Social Icon Data Componente */}
              <SocialIcon metaUserData={metaUserData} guruData={guruData} />
            </div>

            {/* Header Data Componente */}
            <DetailGrurCompo
              axoisFunc={axiosData}
              ViewsCount={ViewsCount}
              guruData={guruData}
              nameParam={nameParam}
              totalFollower={totalFollower}
            />

            <div className="wall-avtar-history">
              <h1>Add Message</h1>
            </div>
            <form onSubmit={handleSubmit(submitBtn)}>
              {nameParam == getUserData?.slug ? (
                <div>
                  <IonLabel color="dark">
                    Send To(Username or Friend's Name)
                  </IonLabel>
                  <IonInput
                    {...register("username", {
                      required: "The username field is required.",
                    })}
                    className="custom"
                    name="username"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="username"
                    as={<div className="error" />}
                  />
                </div>
              ) : (
                ""
              )}

              <IonLabel color="dark">Subject</IonLabel>
              <IonInput
                {...register("subject")}
                className="custom"
                name="subject"
              />

              <IonLabel color="dark">Message</IonLabel>
              <IonTextarea
                {...register("message", {
                  required: "Message field is a required",
                })}
                className="custom"
                name="message"
              ></IonTextarea>
              <ErrorMessage
                errors={errors}
                name="message"
                as={<div className="error" />}
              />

              <IonButton expand="block" className="submit" type="submit">
                Send
              </IonButton>
            </form>
          </div>

          {imageIsOpen === true ? (
            <ImageExpandCompo
              imageIsOpen={imageIsOpen}
              setimageIsOpen={setimageIsOpen}
              guruDataAvatar={guruData?.avatar}
            />
          ) : (
            ""
          )}

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
export default AddMessage;
