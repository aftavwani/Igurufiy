import React, { useEffect, useState, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import axios from "axios";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import Header from "../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import RefreshDataCompo from "../components/RefreshDataCompo";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const BlogDetail: React.FC = () => {
  const params = useParams();
  const paramsBlog = params.blog;
  const Url = process.env.API_SOME_KEY + "blog/" + paramsBlog;
  const [clientTitle, setclientTitle] = useState();
  const [clientSlug, setclientSlug] = useState();
  const [clientBody, setclientBody] = useState("");
  const [clientImage, setclientImage] = useState();
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

  useEffect(() => {
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, [paramsBlog]); // Keep paramsBlog as a dependency

  const axiosData = async () => {
    setstartLoading(true);

    try {
      const response = await axios.get(Url);
      setclientTitle(response.data.data.title);
      setclientSlug(response.data.data.slug);
      setclientBody(response.data.data.body);
      setclientImage(response.data.data.image);
    } catch (error) {
      console.error("Error fetching client data:", error?.response);
      settoastMessage("Failed to fetch client data.");
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

  const imageUrl = "https://igurufy.com/storage/app/public/" + clientImage;
  const detailBannerImg = {
    background: "url(" + imageUrl + ") no-repeat center/cover",
    padding: "100px 10px",
  };

  return (
    <>
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

          <div className="detail-banner-img" style={detailBannerImg}>
            <div className="overlay"></div>
            <h2>{clientSlug}</h2>
          </div>
          <div className="gurus-content explore post-detail-content">
            <h4>
              {clientSlug}: {clientTitle}
            </h4>

            <div className="blog-detail-body">{parse(clientBody)}</div>
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

        {/* Footer Navigate bars component */}
        <Navigate />
      </IonPage>
    </>
  );
};
export default BlogDetail;
