import React, { useEffect, useState, useRef, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonText,
  IonButton,
  useIonViewWillEnter,
  RefresherEventDetail,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import {
  checkmarkOutline,
  star,
  search,
  cart,
  airplane,
  man,
  heart,
  glasses,
  logoYoutube,
  basketball,
  camera,
  logoUsd,
  megaphone,
  eyeOutline,
  checkmarkCircle,
  arrowForward,
  shareSocial,
} from "ionicons/icons";
import { NavLink, Link } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import Rating from "../components/Rating";
import Header from "../components/navigation/Header";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { NotifiContext } from "../context/NotifiContext";

import "swiper/css";
import "swiper/css/effect-fade";
import ViewsFormat from "../components/ViewsFormat";

const Home: React.FC = () => {
  const history = useHistory();
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const scrollTopRef = useRef<HTMLIonContentElement | null>(null);
  const [startLoading, setstartLoading] = useState(false);
  const [gurusData, setgurusData] = useState([]);
  const [blogData, setblogData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
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
      fetchProfileData();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, [checkNetwok]);

  useEffect(() => {
    isLoggedStatus();
  }, [getUserData]);
  
  const isLoggedStatus = async () => {
    const Url = process.env.API_SOME_KEY + "login-status/";
    await axios
      .post(Url, {
        id: getUserData?.id,
        status: 1,
      })
      .then(function (response) {
        // console.log(response?.data);
      })
      .catch(function (error) {
        // console.log(error?.response?.data);
      });
  };

  const axiosData = async () => {
    setstartLoading(true);
    const Url = `${process.env.API_SOME_KEY}home/`;

    try {
      const response = await axios.get(Url);
      setblogData(response?.data?.data?.blog);
      setgurusData(response?.data?.data?.gurus);
    } catch (error) {
      console.error("Error fetching home data:", error?.response);
      settoastMessage("Failed to fetch data.");
    } finally {
      setstartLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(response?.data?.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      settoastMessage("Failed to fetch profile data.");
    }
  };

  const handleNavigation = () => {
    if (getUserData !== null) {
      scrollTopRef.current && scrollTopRef.current.scrollToTop();
    } else {
      history.push("/login");
    }
  };

  const handleLink = () => {
    history.push("/about");
  };

  return (
    <>
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section" ref={scrollTopRef}>
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
            <h1>Rate and Reviews Gurus</h1>
          </div>
          <div className=" gurus-step">
            <p className="heading">See How it Works</p>
            <IonCard className="gurus-card">
              <div>
                <IonIcon icon={star} className="left-icon"></IonIcon>
              </div>
              <div className="right-content">
                <div className="steps">
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>

                  <p>Step 1</p>
                </div>

                <p className="text">SignUp</p>
                <IonText>Register As A Reviewer Or Guru.</IonText>
              </div>
            </IonCard>

            <IonCard className="gurus-card">
              <div>
                <IonIcon icon={search} className="left-icon"></IonIcon>
              </div>
              <div className="right-content">
                <div className="steps">
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>
                  <p>Step 2</p>
                </div>

                <p className="text">Find Gurus</p>
                <IonText>
                  Search For Any Guru By Their IG Or TikTok Username Or By
                  First/Last Name.
                </IonText>
              </div>
            </IonCard>

            <IonCard className="gurus-card">
              <div>
                <IonIcon icon={star} className="left-icon"></IonIcon>
              </div>
              <div className="right-content">
                <div className="steps">
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>

                  <p>Step 3</p>
                </div>

                <p className="text">Leave Reviews</p>
                <IonText>
                  Do This By Finding The Guru Profile You Wish To Leave A Review
                  For. If The Guru Is Not Added To Our Website Yet, Recommend
                  The Guru To Be Added Using The "Recommend Guru To Be Added"
                  Tab And We Will Add Them In 24 Hours.
                </IonText>
              </div>
            </IonCard>
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
              <IonList className="list-item">
                <IonItem>
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>{" "}
                  <IonLabel>Find Authenticated Gurus</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>
                  <IonLabel>No More Delays</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon icon={checkmarkOutline} className="icon"></IonIcon>
                  <IonLabel>No More Online Scamming</IonLabel>
                </IonItem>
              </IonList>

              {/* <NavLink to="/about" className="link"> */}
              <IonButton onClick={handleLink} className="btn" color="light">
                Load More
              </IonButton>
              {/* </NavLink> */}
            </div>

            <div className="industry-section">
              <p className="hding">Explore Gurus By Industry</p>

              <div className="explore-card">
                <Link to="/explore-gurus/E-commerce">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={cart} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>ECOMMERCE</IonCardContent>
                  </IonCard>
                </Link>

                <Link to="/explore-gurus/Travel">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={airplane} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>TRAVEL</IonCardContent>
                  </IonCard>
                </Link>
              </div>

              <div className="explore-card">
                <Link to="/explore-gurus/Entrepreneur">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={man} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>ENTREPRENEUN</IonCardContent>
                  </IonCard>
                </Link>

                <Link to="/explore-gurus/Beauty">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={heart} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>BEAUTY</IonCardContent>
                  </IonCard>
                </Link>
              </div>

              <div className="explore-card">
                <Link to="/explore-gurus/Fashion">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={glasses} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>Fashion</IonCardContent>
                  </IonCard>
                </Link>

                <Link to="/explore-gurus/Youtube">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={logoYoutube} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>YOUTUBE</IonCardContent>
                  </IonCard>
                </Link>
              </div>

              <div className="explore-card">
                <Link to="/explore-gurus/Sports">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={basketball} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>SPORTS</IonCardContent>
                  </IonCard>
                </Link>

                <Link to="/explore-gurus/Photography">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={camera} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>PHOTOGRAPHY</IonCardContent>
                  </IonCard>
                </Link>
              </div>

              <div className="explore-card">
                <Link to="/explore-gurus/Motivational-speaker">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={megaphone} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>MOTIVATIONAL SPEAKER</IonCardContent>
                  </IonCard>
                </Link>

                <Link to="/explore-gurus/Sales">
                  <IonCard className="card">
                    <IonCardHeader>
                      <IonIcon icon={logoUsd} className="icon"></IonIcon>
                    </IonCardHeader>
                    <IonCardContent>SALES</IonCardContent>
                  </IonCard>
                </Link>
              </div>
            </div>

            <div className="explore-slider">
              <div className="slider-heading">
                <IonIcon
                  style={{ color: "#FCBB13", fontSize: "25px" }}
                  icon={star}
                ></IonIcon>
                <h3>Explore Gurus</h3>
              </div>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 2000,
                }}
                // effect="fade"
                slidesPerView={deviceWidth > 700 ? 2 : 1}
              >
                {gurusData.map((guruData: any, index: any) => (
                  <SwiperSlide key={index}>
                    <IonCard className="explore-guru-card">
                      <Link to={`/guru-detail/${guruData?.slug}`}>
                        <div className="explore-guru">
                          <img
                            src={
                              "https://igurufy.com/storage/app/public/" +
                              guruData?.avatar
                            }
                            alt={
                              "https://igurufy.com/storage/app/public/" +
                              guruData?.avatar
                            }
                            style={{ borderRadius: "50%" }}
                          />
                        </div>
                      </Link>

                      {/* Rating Stars Components */}
                      <Rating
                        rating={guruData?.total_profile_reviews}
                        ratingText={false}
                      />

                      <IonText className="explore-guru-title">
                        {guruData?.name}
                        {guruData?.role_id !== 4 ? (
                          <IonIcon
                            icon={checkmarkCircle}
                            style={{ color: "hotpink" }}
                          ></IonIcon>
                        ) : (
                          ""
                        )}
                      </IonText>
                      <br />

                      <IonText>{guruData?.slug}</IonText>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div className="explore-guru-box gurus-box">
                          <div className="explore-guru-icon">
                            <IonIcon
                              size="large"
                              className="icons"
                              icon={eyeOutline}
                            ></IonIcon>
                          </div>
                          <p>
                            <ViewsFormat
                              viewCount={guruData?.profile_views?.length}
                            />
                          </p>
                        </div>

                        <div className="explore-guru-box">
                          <div className="explore-guru-icon">
                            <IonIcon
                              size="large"
                              className="icons"
                              icon={star}
                            ></IonIcon>
                          </div>
                          <p>
                            {guruData?.total_profile_reviews?.length} Reviews
                          </p>
                        </div>
                      </div>
                    </IonCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div>
              <div className="reviewer">
                <IonText color="light" className="ion-text-center">
                  <h4>Rate and Reviews Gurus</h4>
                </IonText>
                <IonText color="light" className="ion-text-center">
                  <h6>From all Over world</h6>
                </IonText>
                <IonButton
                  onClick={handleNavigation}
                  className="button-inner btn"
                >
                  Get Started Now
                </IonButton>
              </div>
            </div>

            <div className="home-post">
              <div className="review-post">
                <h5>Some Tips & Articles</h5>
                <Link to="/blog">
                  <p>
                    Veiw all Articles <IonIcon icon={arrowForward}></IonIcon>
                  </p>
                </Link>
              </div>

              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 2000,
                }}
                effect="fade"
              >
                {blogData.map((data: any, index: any) => (
                  <SwiperSlide key={index}>
                    <IonCard className="post-detail">
                      <IonCardHeader>
                        <img
                          src={
                            "https://igurufy.com/storage/app/public/" +
                            data?.image
                          }
                          alt={
                            "https://igurufy.com/storage/app/public/" +
                            data?.image
                          }
                        />
                      </IonCardHeader>

                      <IonCardContent>
                        <h3 className="heading">{data.title}</h3>
                        <IonText className="post-text" color="dark">
                          {parse(data?.body.substring(0, 150))}...
                        </IonText>
                        <br />
                        <div className="post-bottom">
                          <Link
                            to={`/blog-detail/${data?.slug}`}
                            className="read-more-link"
                          >
                            <IonText>
                              Read More <IonIcon icon={arrowForward}></IonIcon>
                            </IonText>
                          </Link>

                          <Link
                            to={`/blog-detail/${data?.slug}`}
                            className="read-more-link"
                          >
                            <IonIcon
                              icon={shareSocial}
                              className="ion-float-right"
                            ></IonIcon>
                          </Link>
                        </div>
                      </IonCardContent>
                    </IonCard>
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

export default Home;
