import React, { useEffect, useState, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonAvatar,
  IonImg,
  IonIcon,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { NavLink, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { checkmarkCircle, searchCircle } from "ionicons/icons";
import Header from "../components/navigation/Header";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import imageIndexing from "../assets/images/imageIndexing";
import { NotifiContext } from "../context/NotifiContext";

const Followers: React.FC = () => {
  const params = useParams();
  const nameParam = params.name;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [getFollowerData, setgetFollowerData] = useState([]);
  const [totalFollowing, settotalFollowing] = useState([]);
  const [responseAllData, setresponseAllData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
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
      settoastMessage("Sorry something went wrong!");
    }
  }, []);

  const axiosData = async () => {
    setstartLoading(true); // Start loading

    const url = `${process.env.API_SOME_KEY}explore-gurus/${nameParam}/follows`;

    try {
      const response = await axios.get(url);
      const guruData = response?.data?.data?.guru;

      setgetFollowerData(guruData?.totalfollower);
      setresponseAllData(guruData?.totalfollower);
      settotalFollowing(guruData?.totalfollowing);
    } catch (error) {
      console.error("Error fetching guru data:", error?.response);
      settoastMessage("Failed to fetch guru data.");
    } finally {
      setstartLoading(false); // Reset loading state
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

  const handleFollow = (e: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const Url = process.env.API_SOME_KEY + "explore-gurus/post/follower-page";
      axios
        .post(Url, {
          id: e.target.userId,
          login_user: getUserData?.id,
          // check: val,
        })
        .then(function (response) {
          setstartLoading(false);
          setgetFollowerData(response?.data?.data?.data?.totalfollower);
        })
        .catch(function (error) {
          setstartLoading(false);
          console.log(error?.data?.data);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const handleSearching = (e: any) => {
    if (checkNetwok !== false) {
      if (e.target.value !== "") {
        const filtered = responseAllData.filter((item: any) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setgetFollowerData(filtered);
      } else {
        setgetFollowerData(responseAllData);
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  return (
    <>
      <UserMenu />
      <IonPage id="main-content" className="bg-color follow-steps">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section verify-pages">
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
            <h1>Followers</h1>
          </div>

          <div className="gurus-content">
            <div className="following-tabs">
              <NavLink to={"/followers/" + nameParam}>
                <IonText>
                  {getFollowerData != null ? getFollowerData.length : 0}{" "}
                  Followers
                </IonText>
              </NavLink>
              <NavLink to={"/following/" + nameParam}>
                <IonText>
                  {totalFollowing != null ? totalFollowing.length : 0} Following
                </IonText>
              </NavLink>
            </div>

            <IonSearchbar
              searchIcon={searchCircle}
              placeholder="Search Member"
              className="search serachData"
              // onIonChange={handleSearching}
              onInput={handleSearching}
              name="serachData"
              showClearButton="never"
            ></IonSearchbar>

            {getFollowerData != null
              ? getFollowerData.map((getData: any, index: any) => (
                  <IonItem className="suggest-data" key={index}>
                    <Link to={"/guru-detail/" + getData?.slug}>
                      <IonAvatar slot="start">
                        <IonImg
                          src={
                            "https://igurufy.com/storage/app/public/" +
                            getData?.avatar
                          }
                        />
                      </IonAvatar>
                    </Link>
                    <IonLabel>
                      <h2>
                        {getData?.name}
                        {getData?.role_id !== 4 ? (
                          <IonImg
                            className="check-mark-img"
                            src={imageIndexing?.verify}
                          ></IonImg>
                        ) : (
                          ""
                        )}
                      </h2>
                      <p>{moment("2023-09-18").startOf("seconds").fromNow()}</p>
                    </IonLabel>

                    {nameParam == getUserData?.slug ? (
                      <IonButton
                        onClick={handleFollow}
                        btnId={index}
                        userId={getData?.id}
                        checkBtn="0"
                        color="light"
                      >
                        Remove
                      </IonButton>
                    ) : (
                      ""
                    )}
                  </IonItem>
                ))
              : ""}
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
export default Followers;
