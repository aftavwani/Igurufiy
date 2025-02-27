import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonButton,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Header from "../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import RefreshDataCompo from "../components/RefreshDataCompo";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const AdditionalInfo: React.FC = () => {
  const {
    handleSubmit,
    register,
    // getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      webSite: "",
      facebook: "",
      twitter: "",
      instagram: "",
      tiktok: "",
    },
  });
  /**
   *
   * @param data
   */

  const [startLoading, setstartLoading] = useState(false);
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const Url = process.env.API_SOME_KEY + "meta-data/" + getUserData?.id;
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [formData, setformData] = useState({
    webSite: "",
    facebook: "",
    twitter: "",
    instagram: "",
    tiktok: "",
  });
  const [userData, setuserData] = useState({});
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

  useEffect(() => {
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, []); // Add checkNetwork to dependencies

  const axiosData = async () => {
    setstartLoading(true);
    const clientsUrl = Url; // Assuming Url is defined somewhere

    try {
      const response = await axios.get(clientsUrl);
      setformData({
        webSite: response?.data[0]?.website,
        facebook: response?.data[0]?.usermeta?.facebook_url,
        twitter: response?.data[0]?.usermeta?.twitter_url,
        instagram: response?.data[0]?.usermeta?.instagram_url,
        tiktok: response?.data[0]?.usermeta?.tiktok_url,
      });
    } catch (error) {
      console.error("Error fetching data:", error?.response);
      settoastMessage("Failed to fetch data.");
    }

    try {
      const profileResponse = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(profileResponse?.data?.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      settoastMessage("Failed to fetch user data.");
    } finally {
      setstartLoading(false); // Ensure loading state is updated
    }
  };

  const submitBtn = async () => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const Url = process.env.API_SOME_KEY + "meta-data/";
      await axios
        .post(Url, {
          id: getUserData?.id,
          facebook_url: formData?.facebook,
          instagram_url: formData?.instagram,
          tiktok_url: formData?.tiktok,
          twitter_url: formData?.twitter,
          website: formData?.webSite,
          type: "1",
        })
        .then(function (response) {
          axiosData();
          localStorage.setItem(
            "userData",
            JSON.stringify(response?.data?.data)
          );
          setstartLoading(false);
          toast.success(response?.data?.message);
        })
        .catch(function (error) {
          setstartLoading(false);
          toast.success(error?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const onFormChange = (e: any) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
          {/* Refresh Data Component */}
          <RefreshDataCompo
            axiosData={axiosData}
            toastOpen={toastOpen}
            settoastOpen={settoastOpen}
            checkNetwok={checkNetwok}
            setcheckNetwok={setcheckNetwok}
            toastMessage={toastMessage}
            settoastMessage={settoastMessage}
          />

          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="banner-img">
            <h1>Additional Info</h1>
          </div>

          <div className="inner-content registration">
            <form
              onSubmit={handleSubmit(submitBtn)}
              encType="multipart/form-data"
              id="create-course-form"
            >
              <IonLabel color="light">Your Email</IonLabel>
              <IonInput
                placeholder="Email"
                className="custom"
                name="email"
                value={getUserData?.email}
                disabled
              />

              <IonLabel color="light">Web Site</IonLabel>
              <IonInput
                {...register("webSite")}
                placeholder="Web Site"
                className="custom"
                name="webSite"
                type="url"
                onIonInput={onFormChange}
                value={formData?.webSite}
              />

              <IonLabel color="light">Facebook</IonLabel>
              <IonInput
                {...register("facebook")}
                placeholder="Facebook"
                className="custom"
                name="facebook"
                type="url"
                onIonInput={onFormChange}
                value={formData?.facebook}
              />

              <IonLabel color="light">Twitter</IonLabel>
              <IonInput
                {...register("twitter")}
                placeholder="Twitter"
                className="custom"
                name="twitter"
                type="url"
                onIonInput={onFormChange}
                value={formData?.twitter}
              />

              <IonLabel color="light">Instagram</IonLabel>
              <IonInput
                {...register("instagram")}
                placeholder="Instagram"
                className="custom"
                name="instagram"
                type="url"
                onIonInput={onFormChange}
                value={formData?.instagram}
              />

              <IonLabel color="light">TikTok</IonLabel>
              <IonInput
                {...register("tiktok")}
                placeholder="TikTok"
                className="custom"
                name="tiktok"
                type="url"
                onIonInput={onFormChange}
                value={formData?.tiktok}
              />

              <IonButton
                id="present-alert"
                expand="block"
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
export default AdditionalInfo;
