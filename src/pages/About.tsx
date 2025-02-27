import React, { useEffect, useState, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import { IonContent, IonPage, IonIcon, IonText, IonButton } from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { star } from "ionicons/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import RefreshDataCompo from "../components/RefreshDataCompo";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const About: React.FC = () => {
  const Url = process.env.API_SOME_KEY + "aboutus/";
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [clientsData, setclientsData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [deviceWidth, setdeviceWidth] = useState(0);
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
    setdeviceWidth(window.screen.width);
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, []);

  const axiosData = async () => {
    setstartLoading(true);
    const clientsUrl = process.env.API_SOME_KEY + "clients/";

    try {
      const clientsResponse = await axios.get(clientsUrl);
      setclientsData(clientsResponse.data.data);
    } catch (error) {
      console.error("Error fetching clients data:", error?.response);
      settoastMessage("Failed to fetch clients data.");
    }

    try {
      const profileResponse = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(profileResponse.data.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      settoastMessage("Failed to fetch user data.");
    } finally {
      setstartLoading(false);
    }
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

          <div className="banner-img">
            <h1>About Us</h1>
          </div>

          <div className="">
            <div className="gurus-about-service">
              <IonText color="dark" className="ion-text-center">
                <h3>Learn About Our Services</h3>
              </IonText>
              <div>
                <img src={imageIndexing.homeImg} alt={imageIndexing.homeImg} />
              </div>
              <p>
                Igurufy is an online platform that aims to stop online scamming
                and provide a central place for people to leave reviews for
                GURUS offering services via social media platforms like TikTok
                and Instagram. Our platform allows users to search for GURUS in
                a variety of categories, such as fashion, personal development,
                and more. Users can also recommend Gurus be added to the
                platform, which will then be added within 24 hours for reviews
                to be added allowing others to make informed decisions about who
                to work with in the future.
              </p>
            </div>

            <div className="industry-section">
              <p className="hding">Our Mission</p>
              <p className="paragraph">
                Our mission at Igurufy is to create a platform that exposes fake
                GURUS and gives real GURUS the recognition they deserve. We
                believe that everyone should have access to accurate and
                reliable information when it comes to working with GURUS online.
                We want to empower individuals to make informed decisions and to
                protect them from falling victim to online scams. Our goal is to
                create a community of trust and accountability in the online
                world of GURUS and services.
              </p>
            </div>

            <div>
              <div className="reviewer">
                <IonText color="light" className="ion-text-center">
                  <h4>Rate and Reviews Gurus</h4>
                </IonText>
                <IonText color="light" className="ion-text-center">
                  <h6>From all Over world</h6>
                </IonText>
                <Link
                  className="menu-link"
                  to={getUserData !== null ? "/home" : "/login"}
                >
                  <IonButton className="button-inner btn">
                    Get Started Now
                  </IonButton>
                </Link>
              </div>
            </div>

            <div className="about-banner">
              <h3 className="about-client-text">What Our Client Says</h3>

              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={deviceWidth > 767 ? 2 : 1}
              >
                {clientsData.map((clientData: any, index: any) => (
                  <SwiperSlide key={index}>
                    <Link to={"/guru-detail/" + clientData?.author?.slug}>
                      <img
                        src={
                          "https://igurufy.com/storage/app/public/" +
                          clientData?.author?.avatar
                        }
                        alt={
                          "https://igurufy.com/storage/app/public/" +
                          clientData?.author?.avatar
                        }
                      />
                    </Link>
                    <IonText color="light">{clientData?.description}</IonText>
                    <br />

                    <h5>{clientData?.author?.name}</h5>

                    <div>
                      <IonIcon
                        color={
                          clientData?.rating == 1 ||
                          clientData?.rating == 2 ||
                          clientData?.rating == 3 ||
                          clientData?.rating == 4 ||
                          clientData?.rating == 5
                            ? "warning"
                            : "light"
                        }
                        style={{ fontSize: "25px" }}
                        icon={star}
                      ></IonIcon>

                      <IonIcon
                        color={
                          clientData?.rating == 2 ||
                          clientData?.rating == 3 ||
                          clientData?.rating == 4 ||
                          clientData?.rating == 5
                            ? "warning"
                            : "light"
                        }
                        style={{ fontSize: "25px" }}
                        icon={star}
                      ></IonIcon>

                      <IonIcon
                        color={
                          clientData?.rating == 3 ||
                          clientData?.rating == 4 ||
                          clientData?.rating == 5
                            ? "warning"
                            : "light"
                        }
                        style={{ fontSize: "25px" }}
                        icon={star}
                      ></IonIcon>

                      <IonIcon
                        color={
                          clientData?.rating == 4 || clientData?.rating == 5
                            ? "warning"
                            : "light"
                        }
                        style={{ fontSize: "25px" }}
                        icon={star}
                      ></IonIcon>

                      <IonIcon
                        color={clientData?.rating == 5 ? "warning" : "light"}
                        style={{ fontSize: "25px" }}
                        icon={star}
                      ></IonIcon>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
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
export default About;
