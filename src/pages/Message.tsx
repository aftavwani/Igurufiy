import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonIcon,
  IonText,
  isPlatform,
} from "@ionic/react";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { chatboxEllipses } from "ionicons/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/navigation/Header";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import imageIndexing from "../assets/images/imageIndexing";
import { NotifiContext } from "../context/NotifiContext";

const Message: React.FC = () => {
  const isIosDevice = isPlatform("ios");
  const iosDeviceText = isIosDevice === true ? "user-avatar-text" : "";
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [messageData, setmessageData] = useState([]);
  const [ChatData, setChatData] = useState([]);
  const [filterMsgData, setfilterMsgData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [stateData, setstateData] = useState({});
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
    setstartLoading(true);
    const Url = `${process.env.API_SOME_KEY}explore-gurus/${getUserData?.slug}/bp-messages`;
    await axios.get(Url).then(function (response) {
      setChatData(response?.data?.data?.allMessages);
      setmessageData(response?.data?.data?.messages);
      setfilterMsgData(response?.data?.data?.messages);

      setstartLoading(false);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setstateData(response?.data?.data?.userData);
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  const unReadMsg = (param: any) => {
    const filteredData = ChatData.filter((item: any) => {
      return (
        item.read === 1 &&
        item.thread_id === param &&
        item.receiver_id === getUserData?.id
      );
    });
    return filteredData;
  };

  const handleSearching = (e: any) => {
    if (checkNetwok !== false) {
      if (e.target.value !== "") {
        const filtered = messageData.filter((item) => {
          return Object.values(
            item?.messages?.sender_id === getUserData?.id
              ? item?.messages?.receiver
              : item?.messages?.sender
          )
            .join("")
            .toLowerCase()
            .includes(e.target.value.toLowerCase());
        });
        setmessageData(filtered);
      } else {
        setmessageData(filterMsgData);
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
            <h1>Messages</h1>
          </div>

          <div
            className="gurus-content"
            //style={{height: `${window.innerHeight - 308}px`}}
          >
            <IonSearchbar
              placeholder="Search"
              className="search serachData"
              onInput={handleSearching}
              name="serachData"
              showClearButton="never"
            ></IonSearchbar>

            {messageData != null
              ? messageData.map((data: any, index: any) => (
                  <IonItem
                    style={{
                      backgroundColor:
                        unReadMsg(data?.thread_id)?.length > 0
                          ? "#9322986e"
                          : "",
                      borderLeft:
                        unReadMsg(data?.thread_id)?.length > 0
                          ? "3px solid #932298"
                          : "",
                    }}
                    className="suggest-data"
                    key={index}
                  >
                    <Link
                      to={
                        data?.messages?.sender_id === getUserData?.id
                          ? "guru-detail/" + data?.messages?.receiver?.slug
                          : "guru-detail/" + data?.messages?.sender?.slug
                      }
                    >
                      <IonAvatar className="message-avatar" slot="start">
                        <IonImg
                          src={
                            "https://igurufy.com/storage/app/public/" +
                            (data?.messages?.sender_id === getUserData?.id
                              ? data?.messages?.receiver?.avatar
                              : data?.messages?.sender?.avatar)
                          }
                        />
                      </IonAvatar>
                    </Link>
                    <IonLabel>
                      <h2>
                        {data?.messages?.sender_id === getUserData?.id
                          ? data?.messages?.receiver?.name
                          : data?.messages?.sender?.name}

                        {data?.messages?.sender_id === getUserData?.id ? (
                          data?.messages?.receiver?.role_id !== 4 ? (
                            <IonImg
                              className="check-mark-img"
                              src={imageIndexing?.verify}
                            ></IonImg>
                          ) : (
                            ""
                          )
                        ) : data?.messages?.sender?.role_id !== 4 ? (
                          <IonImg
                            className="check-mark-img"
                            src={imageIndexing?.verify}
                          ></IonImg>
                        ) : (
                          ""
                        )}
                      </h2>
                      <p>
                        {data?.messages?.sender_id === getUserData?.id
                          ? "You"
                          : data?.messages?.sender_id === getUserData?.id
                          ? data?.messages?.receiver?.name + `: `
                          : data?.messages?.sender?.name}
                        {": "}
                        {data?.messages?.message}
                      </p>
                    </IonLabel>

                    <Link to={"/guru-detail/user-messages/" + data?.thread_id}>
                      <div className="notify-icon">
                        {unReadMsg(data?.thread_id)?.length > 0 ? (
                          <IonText className="message-page">
                            {unReadMsg(data?.thread_id)?.length}
                          </IonText>
                        ) : (
                          ""
                        )}
                        <IonIcon icon={chatboxEllipses}></IonIcon>
                      </div>
                    </Link>
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
export default Message;
