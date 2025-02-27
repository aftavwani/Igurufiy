import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonViewWillEnter,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { information } from "ionicons/icons";
import DetailGrurCompo from "../components/DetailGuruCompo";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/navigation/Header";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import ViewsFormat from "../components/ViewsFormat";
import SocialIcon from "../components/SocialIcon";
import { NotifiContext } from "../context/NotifiContext";

const ProfileInfo: React.FC = () => {
  const params = useParams();
  const nameParam = params.name;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
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
    login_status: 0,
  });
  const [imageStyle, setimageStyle] = useState("");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [ViewsCount, setViewsCount] = useState(0);
  const [followerCount, setfollowerCount] = useState({
    totalfollower: "",
    totalfollowing: "",
  });
  const viewUrl = process.env.API_SOME_KEY + "profile-views/";
  const Url = process.env.API_SOME_KEY + "explore-guru/" + nameParam;
  const [metaUserData, setmetaUserData] = useState({});
  const [totalFollower, settotalFollower] = useState([]);
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

        if (getUserData !== null) {
          axios
            .post(viewUrl, {
              login_user_id: getUserData?.id,
              view_user_id: guruData.id,
            })
            .then(function (response) {
              setViewsCount(response?.data?.data.length);
            })
            .catch(function (error) {
              console.log(error?.data);
            });
        }
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
      settoastMessage("Sorry something went wrong!");
    }
  }, [nameParam]);

  const axiosData = () => {
    setstartLoading(true);

    axios.get(Url).then(function (response) {
      setguruData(response?.data?.data?.guru);
      setViewsCount(response?.data?.data?.guru?.profile_views?.length);
      setmetaUserData(response?.data?.data?.guru?.usermeta);
      setfollowerCount({
        totalfollower: response?.data?.data?.guru?.totalfollower,
        totalfollowing: response?.data?.data?.guru?.totalfollowing,
      });
      settotalFollower(response?.data?.data?.guru?.totalfollower);
      if (
        response?.data?.data?.guru?.usermeta !== null &&
        response?.data?.data?.guru?.usermeta?.profile_cover !== null &&
        response?.data?.data?.guru?.usermeta?.profile_cover !== ""
      ) {
        setimageStyle(
          `https://igurufy.com/storage/app/public/${response?.data?.data?.guru?.usermeta?.profile_cover}`
        );
      } else {
        setimageStyle(imageIndexing.defaultBanner);
      }

      if (getUserData !== null) {
        axios
          .post(viewUrl, {
            login_user_id: getUserData?.id,
            view_user_id: response?.data?.data?.guru?.id,
          })
          .then(function (response) {
            setViewsCount(response?.data?.data.length);
          })
          .catch(function (error) {
            console.log(error?.data);
          });
      }
      setstartLoading(false);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  return (
    <>
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
          >
            {/* <IonIcon icon={pencilOutline}></IonIcon> */}
          </div>
          <div className="gurus-profile">
            <div className="avtar-info">
              <div className="avtar-img info-avtar-img">
                <img
                  src={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  alt={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  width="50%"
                />
                <p>{guruData?.login_status === 1 ? "Online" : "Offline"}</p>
              </div>
              <div className="avtar-cntnt">
                <h2>
                  @
                  {guruData.ig_username != null
                    ? guruData.ig_username
                    : guruData.tiktok_username}
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
            <div className="viewers">
              <div className="follower">
                <Link
                  to={
                    getUserData !== null
                      ? "/followers/" + nameParam
                      : "/guru-detail/" + nameParam
                  }
                >
                  <h5>
                    {followerCount?.totalfollower != null
                      ? followerCount?.totalfollower.length
                      : 0}{" "}
                    Followers
                  </h5>
                </Link>
              </div>
              <div className="following">
                <Link
                  to={
                    getUserData !== null
                      ? "/following/" + nameParam
                      : "/guru-detail/" + nameParam
                  }
                >
                  <h5>
                    {followerCount != null
                      ? followerCount?.totalfollowing?.length
                      : 0}{" "}
                    Following
                  </h5>
                </Link>
              </div>
              <div className="view">
                <h5>
                  <ViewsFormat viewCount={ViewsCount} />
                </h5>
              </div>
              <div className="post">
                <h5>
                  {guruData.posts != null ? guruData.posts.length : 0} Post
                </h5>
              </div>
            </div>

            {/* Header Data Componente */}
            <DetailGrurCompo
              axoisFunc={axiosData}
              ViewsCount={ViewsCount}
              guruData={guruData}
              nameParam={nameParam}
              totalFollower={totalFollower}
            />

            <div className="info-profile">
              <IonIcon icon={information}></IonIcon> <h1> Profile Info</h1>
            </div>
            <div className="avtar-heading">
              <h2>Name</h2>
              <p>{guruData != null ? guruData.name : ""}</p>
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
export default ProfileInfo;
