import React, { useEffect, useState, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import { IonContent, IonPage } from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import moment from "moment";
import Header from "../components/navigation/Header";
import { Network } from "@capacitor/network";
import ConnectionToast from "../components/ConnectionToast";
import RefreshDataCompo from "../components/RefreshDataCompo";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

import "swiper/css";
import "swiper/css/effect-fade";

const Blog: React.FC = () => {
  const Url = process.env.API_SOME_KEY + "blog/";
  const [blogsData, setblogsData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [deviceWidth, setdeviceWidth] = useState(0);
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
    setdeviceWidth(window.screen.width);
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, []); // Added checkNetwork to the dependency array

  const axiosData = async () => {
    setstartLoading(true);
    const blogsUrl = Url; // Assuming Url is defined somewhere

    try {
      const response = await axios.get(blogsUrl);
      setblogsData(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs data:", error?.response);
      settoastMessage("Failed to fetch blogs data.");
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

          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            autoplay={{
              delay: 2000,
            }}
            effect="fade"
            slidesPerView={deviceWidth > 767 ? 2 : 1}
          >
            {blogsData.map((blogData: any, index: any) => (
              <SwiperSlide key={index}>
                <div className="industry-section">
                  <div className="blog-heading">
                    <h3>Blog</h3>
                    <p>
                      {moment(blogData.created_at).utc().format("dddd D MMMM")}
                    </p>
                  </div>
                  <div
                    className="blog-banner-img"
                    style={{
                      background:
                        "url(https://igurufy.com/storage/app/public/" +
                        blogData.image +
                        ") no-repeat center/cover",
                    }}
                  >
                    <div className="overlay1"></div>
                    <Link to={`/blog-detail/${blogData.slug}`}>
                      <div className="blog-name">
                        <div className="blog-btn">{blogData.slug}</div>
                        <h2>{blogData.title}</h2>
                      </div>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="gurus-content explore">
            <div className="post-btn">
              <h2>For You</h2>
              {/* <IonButton className="btn" color="light">
                View All
              </IonButton> */}
            </div>

            <div className="post-images">
              {blogsData.map((blogData: any, index: any) => (
                <div
                  className="blog-health-img cstm-blog"
                  style={{
                    background:
                      "url(https://igurufy.com/storage/app/public/" +
                      blogData.image +
                      ") no-repeat center/cover",
                  }}
                  key={index}
                >
                  <div className="overlay"></div>
                  <Link to={`/blog-detail/${blogData.slug}`}>
                    <div className="cntnt">
                      <h4 style={{ color: "#fff" }}>{blogData.slug}</h4>
                      <p style={{ color: "#fff" }}>{blogData.title}</p>
                    </div>
                  </Link>
                </div>
              ))}
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

        {/* Footer Navigate bars component */}
        <Navigate />
      </IonPage>
    </>
  );
};
export default Blog;
