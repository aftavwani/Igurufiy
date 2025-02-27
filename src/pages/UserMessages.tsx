import React, { useEffect, useState, useRef, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
  IonImg,
  IonInput,
  IonIcon,
} from "@ionic/react";
import Navigate from "../components/navigation/Navigate";
import { arrowBack, checkmarkCircle } from "ionicons/icons";
import Header from "../components/navigation/Header";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import UserMenu from "../components/menu/UserMenu";
import { NotifiContext } from "../context/NotifiContext";

const UserMessages: React.FC = () => {
  const parameter = useParams();
  const paramId = parameter.thread_id;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const Url = `${process.env.API_SOME_KEY}explore-gurus/${getUserData?.slug}/bp-messages/new-message/thread_id/${paramId}`;
  const [startLoading, setstartLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLIonContentElement | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      chat: "",
      chatImage: "",
    },
  });
  /**
   *
   * @param data
   */

  const [getChatData, setgetChatData] = useState([]);
  const [filter, setfilter] = useState({});
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [getGuruData, setgetGuruData] = useState({
    fcm_token: "",
  });
  const [chatSubBtn, setChatSubBtn] = useState(false);
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
      reset();
      if (checkNetwok !== false) {
        axiosData();
      } else {
        settoastMessage("Sorry, something went wrong!");
        settoastOpen(true);
      }
      event.detail.complete();
    }, 2000);
  }

  function ScrollToBottom() {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  }

  useEffect(() => {
    logCurrentNetworkStatus();
    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry something went wrong!");
    }
  }, [paramId]);

  const axiosData = async () => {
    setstartLoading(true);
    await axios.get(Url).then(function (response) {
      setgetChatData(response?.data?.data?.messages);
      setgetGuruData(response?.data?.data?.guru);
      setfilter(
        response?.data?.data?.messages[
          response?.data?.data?.messages.length - 1
        ]
      );
      setstartLoading(false);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  const chatUrl =
    process.env.API_SOME_KEY + "bp-messages/new-message/thread_id/msg";
  const chatSub = async (data: any) => {
    if (checkNetwok !== false) {
      if (data.chat != "") {
        setChatSubBtn(true);
        await axios
          .post(chatUrl, {
            message: data.chat,
            sender_id: getUserData?.id,
            thread_id: paramId,
            receiver_id:
              Object.keys(filter).length > 0 &&
              filter?.sender_id != getUserData?.id
                ? filter?.sender_id
                : filter?.receiver_id,
            fcm_token:
              Object.keys(filter).length > 0 &&
              filter?.sender_id != getUserData?.id
                ? filter?.sender?.fcm_token
                : filter?.receiver?.fcm_token,
          })
          .then(function (response) {
            setgetChatData(response?.data?.data?.messages);
            reset();
            setChatSubBtn(false);
          })
          .catch(function (error) {
            console.log(error?.response);
            setChatSubBtn(false);
          });
      } else {
        toast.error("Type Your Message!");
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const commentStyle = {
    display: "flex",
    justifyContent: "end",
    marginLeft: "100px",
  };
  const divCommentStyle = {
    display: "flex",
    justifyContent: "start",
    marginRight: "100px",
  };
  const style = {
    backgroundColor: "#AA3DB0",
    color: "#FFFFFF",
    overflowWrap: "anywhere",
  };
  const divStyle = {
    backgroundColor: "#D9D9D9",
    color: "#7B7B7B",
    overflowWrap: "anywhere",
  };
  const divTimeStyle = {
    marginLeft: "35px",
    fontSize: "12px",
    marginBottom: "8px",
  };
  const timeStyle = {
    display: "flex",
    justifyContent: "end",
    marginBottom: "8px",
    fontSize: "12px",
  };

  const userProfileSlug =
    Object.keys(filter).length > 0 && filter?.sender_id != getUserData?.id
      ? filter?.sender?.slug
      : filter?.receiver?.slug;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color user-messages">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen ref={scrollBottomRef} className="top-section">
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

          {/* <div className="banner-img">
            <h1>Message</h1>
          </div> */}

          <div className="gurus-content">
            <IonCard>
              <IonCardHeader>
                <IonItem className="top-info">
                  <IonAvatar slot="start">
                    <Link to={"/guru-detail/" + userProfileSlug}>
                      <IonImg
                        src={
                          "https://igurufy.com/storage/app/public/" +
                          (Object.keys(filter).length > 0 &&
                          filter?.sender_id != getUserData?.id
                            ? filter?.sender?.avatar
                            : filter?.receiver?.avatar)
                        }
                      />
                    </Link>
                  </IonAvatar>
                  <IonLabel>
                    <h2>
                      {Object.keys(filter).length > 0 &&
                      filter?.sender_id != getUserData?.id
                        ? filter?.sender?.name
                        : filter?.receiver?.name}

                      {Object.keys(filter).length > 0 &&
                      filter?.sender_id != getUserData?.id ? (
                        filter?.sender?.role_id !== 4 ? (
                          <IonIcon
                            icon={checkmarkCircle}
                            className="name-check-mark"
                          ></IonIcon>
                        ) : (
                          ""
                        )
                      ) : filter?.receiver?.role_id !== 4 ? (
                        <IonIcon
                          icon={checkmarkCircle}
                          className="name-check-mark"
                        ></IonIcon>
                      ) : (
                        ""
                      )}
                    </h2>
                    <p>
                      {Object.keys(filter).length > 0 &&
                      filter?.sender_id != getUserData?.id
                        ? filter?.sender?.role_id == 3 ||
                          filter?.sender?.role_id == 5
                          ? "Guru"
                          : filter?.sender?.role_id == 1
                          ? "Admin"
                          : filter?.sender?.role_id == 4
                          ? "Reviewer"
                          : ""
                        : filter?.receiver?.role_id == 3 ||
                          filter?.receiver?.role_id == 5
                        ? "Guru"
                        : filter?.receiver?.role_id == 1
                        ? "Admin"
                        : filter?.receiver?.role_id == 4
                        ? "Reviewer"
                        : ""}
                    </p>
                  </IonLabel>
                  <Link to="/message">
                    <IonIcon icon={arrowBack}></IonIcon>
                  </Link>
                </IonItem>
              </IonCardHeader>
              <IonCardContent className="chat-content">
                {getChatData.map((data: any, index: any) => (
                  <div key={index}>
                    <div
                      className="chat-box"
                      style={
                        data.sender_id == getUserData?.id
                          ? commentStyle
                          : divCommentStyle
                      }
                    >
                      {data.sender_id != getUserData?.id ? (
                        <img
                          style={{ borderRadius: "50%", width: "30px" }}
                          src={
                            "https://igurufy.com/storage/app/public/" +
                            data?.sender?.avatar
                          }
                        />
                      ) : (
                        ""
                      )}
                      <IonLabel>
                        <h3
                          style={
                            data.sender_id == getUserData?.id ? style : divStyle
                          }
                        >
                          {data?.message}
                        </h3>
                        <ScrollToBottom />
                      </IonLabel>
                    </div>
                    <div
                      style={
                        data.sender_id == getUserData?.id
                          ? timeStyle
                          : divTimeStyle
                      }
                    >
                      {moment(data?.created_at).utc().format("h:ss a")}
                    </div>
                  </div>
                ))}
              </IonCardContent>
              <div className="chat-bottom">
                <form onSubmit={handleSubmit(chatSub)}>
                  <IonInput
                    {...register("chat")}
                    id="text"
                    placeholder="message......."
                  />
                  <IonButton
                    type="submit"
                    expand="block"
                    className="submit button-inner"
                    disabled={chatSubBtn}
                  >
                    Send
                  </IonButton>
                </form>
              </div>
            </IonCard>
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
export default UserMessages;
