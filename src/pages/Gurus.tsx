import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonCard,
  IonIcon,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import {
  searchCircle,
  star,
  checkmarkCircle,
  eyeOutline,
} from "ionicons/icons";
import axios from "axios";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import Header from "../components/navigation/Header";
import { useParams } from "react-router-dom";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards } from "swiper/modules";
import ViewsFormat from "../components/ViewsFormat";
import { NotifiContext } from "../context/NotifiContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";

const Gurus: React.FC = () => {
  const parameter = useParams();
  let categoryParam = parameter.category;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [responseAllData, setresponseAllData] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [searchInputData, setSearchInputData] = useState("");
  const [paramData, setparamData] = useState("");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  var Url = `${process.env.API_SOME_KEY}explore-gurus`;
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
    axiosData();
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    }
  }, [categoryParam, checkNetwok]);

  const axiosData = async () => {
    setstartLoading(true);

    try {
      const response = await axios.post(Url, {
        id: await getUserData?.id,
      });

      setresponseAllData(response?.data?.data);
      setfilteredResults(response?.data?.data);
      console.log("id:", getUserData?.id);
      console.log("data:", response);

      if (categoryParam != null) {
        setparamData(categoryParam);
        const filteredData = response.data.data.filter(
          (item: any) => item.industry === categoryParam
        );
        setfilteredResults(filteredData);
      } else {
        setfilteredResults(response.data.data);
      }
    } catch (error) {
      console.error("Error in POST request:", error?.response?.data);
    } finally {
      setstartLoading(false);
    }

    try {
      const profileResponse = await axios.get(
        `${process.env.API_SOME_KEY}profile/${await getUserData?.id}`
      );
      setNotifiCount(profileResponse?.data?.data?.userData);
    } catch (error) {
      console.error("Error in GET request:", error?.response?.data);
    }
  };

  // useIonViewWillEnter(() => {
  //   axiosData();
  // });

  const [inputSelect, setinputSelect] = useState("");

  const selectValue = (e: any) => {
    if (checkNetwok !== false) {
      setparamData(e.target.value);
      if (searchInputData !== "") {
        if (e.target.value !== "Show-all") {
          const filteredData = responseAllData.filter((item: any) => {
            return Object.values(item)
              .join("")
              .toLowerCase()
              .includes(searchInputData);
          });
          setfilteredResults(filteredData);
        } else {
          const filteredData = responseAllData.filter((item: any) => {
            return (
              Object.values(item)
                .join("")
                .toLowerCase()
                .includes(searchInputData) && item.industry === e.target.value
            );
          });
          setfilteredResults(filteredData);
        }
      } else {
        setinputSelect(e.target.value);

        if (e.target.value !== "Show-all") {
          const filteredData = responseAllData.filter((item: any) => {
            return item.industry === e.target.value;
          });
          setfilteredResults(filteredData);
        } else {
          setfilteredResults(responseAllData);
        }
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const searchValue = (e: any) => {
    if (checkNetwok !== false) {
      if (inputSelect !== "Show-all") {
        if (inputSelect !== "") {
          if (e.target.value !== "") {
            const filteredData = responseAllData.filter((item: any) => {
              return (
                Object.values(item)
                  .join("")
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) &&
                item.industry === inputSelect
              );
            });
            setfilteredResults(filteredData);
          } else {
            const filteredData = responseAllData.filter((item: any) => {
              return item.industry === inputSelect;
            });
            setfilteredResults(filteredData);
          }
        } else {
          setSearchInputData(e.target.value);
          if (e.target.value !== "") {
            const filteredData = responseAllData.filter((item) => {
              return Object.values(item)
                .join("")
                .toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            setfilteredResults(filteredData);
          } else {
            setfilteredResults(responseAllData);
          }
        }
      } else {
        const filteredData = responseAllData.filter((item: any) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setfilteredResults(filteredData);
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  return (
    <>
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section explor-gurus">
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
            <h1>Explore Gurus</h1>
          </div>
          <div className="gurus-content explore">
            <div className="gurus-search">
              <IonItem className="select">
                <IonSelect
                  aria-label="Fruit"
                  id="nameofid"
                  interface="popover"
                  placeholder="Select Industry"
                  onIonChange={selectValue}
                  name="category"
                  value={
                    typeof categoryParam != "undefined"
                      ? categoryParam
                      : paramData
                  }
                >
                  <IonSelectOption value="Show-all">Show All</IonSelectOption>
                  <IonSelectOption value="E-commerce">
                    E-COMMERCE
                  </IonSelectOption>
                  <IonSelectOption value="Travel">TRAVEL</IonSelectOption>
                  <IonSelectOption value="Entrepreneur">
                    ENTREPRENEUR
                  </IonSelectOption>
                  <IonSelectOption value="Beauty">BEAUTY</IonSelectOption>
                  <IonSelectOption value="Fashion">FASHION</IonSelectOption>
                  <IonSelectOption value="Youtube">YOUTUBE</IonSelectOption>
                  <IonSelectOption value="Sports">SPORTS</IonSelectOption>
                  <IonSelectOption value="Photography">
                    PHOTOGRAPHY
                  </IonSelectOption>
                  <IonSelectOption value="Motivational-speaker">
                    MOTIVATIONAL SPEAKER
                  </IonSelectOption>
                  <IonSelectOption value="Sales">SALES</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonSearchbar
                searchIcon={searchCircle}
                placeholder="Search Member"
                className="search serachData"
                onInput={searchValue}
                name="serachData"
                showClearButton="never"
              ></IonSearchbar>
            </div>

            <Swiper
              modules={[Navigation, Pagination, EffectCards]}
              navigation
              // effect="cards"
              slidesPerView={deviceWidth > 767 ? 2 : 1}
            >
              {filteredResults.map((responseData: any, index: any) => (
                <SwiperSlide key={index}>
                  <IonCard className="explore-guru-card">
                    <Link to={`/guru-detail/${responseData?.slug}`}>
                      <div className="explore-guru">
                        <img
                          src={
                            "https://igurufy.com/storage/app/public/" +
                            responseData?.avatar
                          }
                          alt={
                            "https://igurufy.com/storage/app/public/" +
                            responseData?.avatar
                          }
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                    </Link>

                    {/* Rating Stars Components */}
                    <Rating
                      rating={responseData?.total_profile_reviews}
                      ratingText={false}
                    />

                    <IonText className="explore-guru-title">
                      {responseData?.name}
                      {responseData?.role_id !== 4 ? (
                        <IonIcon
                          icon={checkmarkCircle}
                          className="name-check-mark"
                        ></IonIcon>
                      ) : (
                        ""
                      )}
                    </IonText>
                    <br />

                    <IonText>
                      @
                      {responseData?.ig_username != null
                        ? responseData?.ig_username
                        : responseData?.tiktok_username}
                    </IonText>

                    <div style={{ display: "flex", justifyContent: "center" }}>
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
                            viewCount={responseData?.profile_views.length}
                          />
                        </p>
                      </div>

                      <Link
                        to={`/guru-detail/${responseData?.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="explore-guru-box">
                          <div className="explore-guru-icon">
                            <IonIcon
                              size="large"
                              className="icons"
                              icon={star}
                            ></IonIcon>
                          </div>
                          <p>
                            {responseData?.total_profile_reviews?.length}{" "}
                            Reviews
                          </p>
                        </div>
                      </Link>
                    </div>
                  </IonCard>
                </SwiperSlide>
              ))}
            </Swiper>
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

        <Navigate />
      </IonPage>
    </>
  );
};
export default Gurus;
