import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
  IonImg,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Header from "../components/navigation/Header";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const Notification: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const Url = `${process.env.API_SOME_KEY}explore-gurus/${getUserData?.slug}/notifications/all`;
  const [notificationData, setnotificationData] = useState([]);
  const [followerData, setfollowerData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const readUrl = `${process.env.API_SOME_KEY}notifications/read/${getUserData?.id}`;
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

  const axiosData = () => {
    setstartLoading(true);
    axios.get(Url).then(function (response) {
      setnotificationData(response?.data?.data?.notifications);
      setfollowerData(response?.data?.data?.followers);
      setstartLoading(false);
    });

    axios.get(readUrl).then(function (response) {
      setnotificationData(response?.data?.data?.notifications);
      //setNotifiCount(response?.data?.data?.notifications);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  const myFunc = (parm: any, pparm: any) => {
    const filteredData = followerData.filter((item: any) => {
      return item.login_user_id === parm && item.follow_user_id === pparm;
    });
    return filteredData.length;
  };

  const handleFollow = (e: any) => {
    if (checkNetwok !== false) {
      if (e.target.innerText === "Follow") {
        var val = 1;
      } else {
        var val = 0;
      }
      setstartLoading(true);
      const Url =
        process.env.API_SOME_KEY + "explore-gurus/post/following-page";
      axios
        .post(Url, {
          id: e.target.userId,
          login_user: getUserData?.id,
          check: val,
        })
        .then(function (response) {
          setstartLoading(false);
          axiosData();
        })
        .catch(function (error) {
          setstartLoading(false);
        });
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
            <h1>Notifications</h1>
          </div>

          <div className="gurus-content">
            <div className="today-notification">
              {notificationData != null
                ? notificationData.map((notifyData: any, index: any) => (
                    <IonItem
                      style={{
                        backgroundColor:
                          notifyData.read == 1 ? "#9322986e" : "",
                        borderLeft:
                          notifyData.read == 1 ? "3px solid #932298" : "",
                      }}
                      className="suggest-data notification-page"
                      key={index}
                    >
                      <Link to={"/guru-detail/" + notifyData?.sender?.slug}>
                        <IonAvatar slot="start">
                          <IonImg
                            src={
                              "https://igurufy.com/storage/app/public/" +
                              notifyData.sender.avatar
                            }
                          />
                        </IonAvatar>
                      </Link>
                      <IonLabel>
                        <h4>
                          {notifyData?.sender?.name}
                          {notifyData?.sender?.role_id !== 4 ? (
                            <IonImg
                              className="check-mark-img"
                              src={imageIndexing?.verify}
                            ></IonImg>
                          ) : (
                            ""
                          )}
                        </h4>
                        <p className="msg">{notifyData?.message}</p>
                        <p>{moment(notifyData?.created_at).fromNow()}</p>
                      </IonLabel>

                      {notifyData?.message ===
                      "added new review on your profile" ? (
                        <Link to={"/guru-detail/" + getUserData?.slug}>
                          <IonButton className="follow">Respond Back</IonButton>
                        </Link>
                      ) : notifyData?.message === "started following you." ? (
                        <IonButton
                          className={
                            myFunc(
                              notifyData?.user_id,
                              notifyData?.sender_id
                            ) == 1
                              ? // &&
                                // myFunc(notifyData?.sender_id, notifyData?.user_id)
                                "unfollow"
                              : "follow"
                          }
                          onClick={(e) => handleFollow(e)}
                          btnId={index}
                          userId={notifyData?.sender_id}
                          checkbutton="0"
                        >
                          {myFunc(notifyData?.user_id, notifyData?.sender_id) ==
                          1
                            ? //   &&
                              // myFunc(notifyData?.sender_id, notifyData?.user_id) ==
                              //   1
                              "Following"
                            : "Follow"}
                        </IonButton>
                      ) : notifyData?.message === "likes your post" ||
                        notifyData?.message === "commented on your post" ? (
                        <Link to="/profile">
                          <img
                            alt={imageIndexing.follow}
                            src={imageIndexing.follow}
                            style={{ float: "right" }}
                            className="followimg"
                          />
                        </Link>
                      ) : notifyData?.message ===
                        "sent you a new private message" ? (
                        <Link
                          to={
                            "/guru-detail/user-messages/" +
                            notifyData?.source.split("/").pop()
                          }
                        >
                          <IonButton className="follow">Reply Back</IonButton>
                        </Link>
                      ) : (
                        ""
                      )}
                    </IonItem>
                  ))
                : ""}
            </div>

            {/* </IonList> */}
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
export default Notification;
