import React, { useState, useEffect, useContext } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonItem,
  IonButton,
  IonToggle,
  IonText,
  IonAlert,
} from "@ionic/react";
import UserMenu from "../../components/menu/UserMenu";
import Navigate from "../../components/navigation/Navigate";
import axios from "axios";
import Header from "../../components/navigation/Header";
import { toast, Toaster } from "react-hot-toast";
import { Network } from "@capacitor/network";
import ConnectionToast from "../../components/ConnectionToast";
import RefreshDataCompo from "../../components/RefreshDataCompo";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import { NotifiContext } from "../../context/NotifiContext";
import moment from "moment";
import { useHistory } from "react-router-dom";

const AccountSetting: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const Url = `${process.env.API_SOME_KEY}settings/account-setting/${getUserData?.id}`;
  const [mentionMetaData, setmentionMetaData] = useState("");
  const [replieMetaData, setreplieMetaData] = useState("");
  const [messageMetaData, setmessageMetaData] = useState("");
  const [userMetaData, setuserMetaData] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const { setNotifiCount } = useContext(NotifiContext);
  const history = useHistory();

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
      setuserMetaData(response?.data?.data?.user?.usermeta);
      setmentionMetaData(
        response?.data?.data?.user?.usermeta?.mention_notifications
      );
      setreplieMetaData(
        response?.data?.data?.user?.usermeta?.replies_notifications
      );
      setmessageMetaData(
        response?.data?.data?.user?.usermeta?.message_notifications
      );
      setstartLoading(false);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  const handleMention = (e: any) => {
    if (e.target.checked === true) {
      setmentionMetaData("Active");
    } else {
      setmentionMetaData("Inactive");
    }
  };

  const handleRelies = (e: any) => {
    if (e.target.checked === true) {
      setreplieMetaData("Active");
    } else {
      setreplieMetaData("Inactive");
    }
  };

  const handleMessage = (e: any) => {
    if (e.target.checked === true) {
      setmessageMetaData("Active");
    } else {
      setmessageMetaData("Inactive");
    }
  };

  const handleChanges = async (e: any) => {
    setstartLoading(true);

    const Url = process.env.API_SOME_KEY + "settings/update";
    await axios
      .post(Url, {
        mention_notification: mentionMetaData,
        replies_notification: replieMetaData,
        message_notification: messageMetaData,
        user_id: getUserData?.id,
      })
      .then(function (response) {
        setmentionMetaData(
          response?.data?.data?.user?.usermeta?.mention_notifications
        );
        setreplieMetaData(
          response?.data?.data?.user?.usermeta?.replies_notifications
        );
        setmessageMetaData(
          response?.data?.data?.user?.usermeta?.message_notifications
        );
        setstartLoading(false);
        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        setstartLoading(false);
        toast.error(error?.response?.data?.message);
      });
  };

  const deleteAccount = async () => {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
    // return false
    setstartLoading(true);
    try {
      await axios
        .post(process.env.API_SOME_KEY + "delete-request", {
          id: getUserData?.id,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .then((response) => {
          console.log(response?.data);
          localStorage.removeItem("userData");
          history.push("/index");
          toast.success(response?.data?.message, {
            duration: 10000,
          });
        });
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setstartLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color follow-steps">
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
            <h1>Account Setting</h1>
          </div>

          <div className="account-setting">
            <div className="gurus-profile-form">
              <form>
                <IonItem>
                  <IonToggle
                    onIonChange={handleMention}
                    name="mentionNotifi"
                    className="settig-toggle"
                    color="favorite"
                    checked={
                      userMetaData !== null && mentionMetaData !== "Inactive"
                        ? true
                        : false
                    }
                  >
                    <h4>Mention Notifications</h4>
                    <IonText className="ion-text-wrap">
                      Email me when a member mentions me in a post.
                    </IonText>
                  </IonToggle>
                </IonItem>
                <IonItem>
                  <IonToggle
                    name="repliesNotifi"
                    onIonChange={handleRelies}
                    className="settig-toggle"
                    color="favorite"
                    checked={
                      userMetaData !== null && replieMetaData !== "Inactive"
                        ? true
                        : false
                    }
                  >
                    <h4>Replies Notifications</h4>
                    <IonText className="ion-text-wrap">
                      Email me when a member replies to a post or comment i have
                      posted.
                    </IonText>
                  </IonToggle>
                </IonItem>
                <IonItem>
                  <IonToggle
                    name="messageNotifi"
                    onIonChange={handleMessage}
                    className="settig-toggle"
                    color="favorite"
                    checked={
                      userMetaData !== null && messageMetaData !== "Inactive"
                        ? true
                        : false
                    }
                  >
                    <h4>Message Notifications</h4>
                    <IonText className="ion-text-wrap">
                      Email me when a member send me a new message.
                    </IonText>
                  </IonToggle>
                </IonItem>
                <div className="del-account-container">
                  <IonButton onClick={handleChanges}>Save Changes</IonButton>
                  <IonButton id="delete-account-present" color="commentToast">
                    Delete Account
                  </IonButton>

                  <IonAlert
                    header="Are you sure you want to delete your account permanent?"
                    trigger="delete-account-present"
                    buttons={[
                      {
                        text: "No, keep my account",
                        role: "cancel",
                        handler: () => {
                          console.log("Delete account proccess canceled");
                        },
                      },
                      {
                        text: "Yes, delete my account",
                        role: "confirm",
                        handler: () => {
                          deleteAccount();
                        },
                      },
                    ]}
                    onDidDismiss={({ detail }) =>
                      console.log(`Dismissed with role: ${detail.role}`)
                    }
                  ></IonAlert>
                </div>
              </form>
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
export default AccountSetting;
