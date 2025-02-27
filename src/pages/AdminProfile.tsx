import React, { useState, useRef, useEffect } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  useIonLoading,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import {
  add,
  remove,
  chatboxEllipsesOutline,
  notificationsOutline,
} from "ionicons/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import Complement from "../components/Complement";
import Rating from "../components/Rating";
import { useHistory } from "react-router-dom";
import Header from "../components/navigation/Header";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const AdminProfile: React.FC = () => {
  const history = useHistory();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
      postImage: "",
    },
  });
  /**
   *
   * @param data
   */

  const getUserData = JSON.parse(localStorage.getItem("userData") || '""');

  const params = useParams();
  const nameParam = params.name;
  const [presentLoading, dismissLoading] = useIonLoading();
  const [guruData, setguruData] = useState({
    avatar: "",
    slug: "",
    ig_username: "",
    tiktok_username: "",
    username: "",
    total_profile_reviews: "",
    profile_views: "",
    totalfollower: "",
    totalfollowing: "",
    posts: "",
    name: "",
    reviews: "",
    usermeta: "",
    id: "",
    login_status: "",
  });
  const [profileBanner, setprofileBanner] = useState("");

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  const [formHide, setformHide] = useState("none");
  const [btnIcon, setbtnIcon] = useState(add);
  const formToggel = () => {
    if (formHide == "none") {
      setformHide("block");
      setbtnIcon(remove);
    } else {
      setformHide("none");
      setbtnIcon(add);
      reset();
    }
  };

  const [allPosts, setallPosts] = useState([]);

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      if (nameParam != getUserData?.slug) {
        history.push("/guru-detail/" + nameParam);
      }
      setformHide("none");
      setbtnIcon(add);
      reset();
      setPresentingElement(page.current);
      const Url = process.env.API_SOME_KEY + "explore-guru/" + nameParam;

      axios.get(Url).then(function (response) {
        setguruData(response?.data?.data?.guru);
        setallPosts(response?.data?.data?.posts);
        console.log(response?.data?.data);

        if (
          response?.data?.data?.guru?.usermeta != null &&
          response?.data?.data?.guru?.usermeta?.profile_cover != null
        ) {
          setprofileBanner(
            `https://igurufy.com/storage/app/public/${response?.data?.data?.guru?.usermeta?.profile_cover}`
          );
        } else {
          setprofileBanner(imageIndexing.defaultBanner);
        }
      });
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    if (nameParam != getUserData?.slug) {
      history.push("/guru-detail/" + nameParam);
    }
    setPresentingElement(page.current);
    const Url = process.env.API_SOME_KEY + "explore-guru/" + nameParam;

    axios.get(Url).then(function (response) {
      setguruData(response?.data?.data?.guru);
      setallPosts(response?.data?.data?.posts);
      console.log(response?.data?.data);

      if (
        response?.data?.data?.guru?.usermeta != null &&
        response?.data?.data?.guru?.usermeta?.profile_cover != null
      ) {
        setprofileBanner(
          `https://igurufy.com/storage/app/public/${response?.data?.data?.guru?.usermeta?.profile_cover}`
        );
      } else {
        setprofileBanner(imageIndexing.defaultBanner);
      }
    });
  }, [nameParam]);

  const Url = process.env.API_SOME_KEY + "add-post";
  const submitBtn = async (data: any) => {
    presentLoading({
      message: "Loading...",
    });
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("image", data.postImage[0]);
    formData.append("user_id", getUserData?.id);

    await axios({
      method: "post",
      url: Url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        modal.current?.dismiss();
        reset();
        toast.success(response?.data?.message);
        dismissLoading();
      })
      .catch(function (error) {
        toast.error(error?.response?.data?.message);
        dismissLoading();
      });
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage ref={page} id="main-content" className="bg-color admin-page">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="banner-img">
            <h1>Home</h1>
          </div>

          <div className="inner-content gurus-profile-form  registration">
            <div
              className="profile-banner"
              style={{
                background: `url(${profileBanner}) no-repeat center/cover`,
              }}
            ></div>

            <div className="profile-images admin-images">
              <img
                className="profile-avtar"
                src={
                  "https://igurufy.com/storage/app/public/" + guruData.avatar
                }
                alt={
                  "https://igurufy.com/storage/app/public/" + guruData.avatar
                }
              />
            </div>

            <div className="admin-home">
              <div className="admin-bio">
                <h2>
                  @
                  {guruData.ig_username != null
                    ? guruData.ig_username
                    : guruData.tiktok_username != null
                    ? guruData.tiktok_username
                    : guruData.username}
                </h2>
                <p>{guruData.name}</p>
              </div>
              <div className="admin-btn">
                <IonButton shape="round">
                  {guruData.login_status == "0" ? "Online" : "Offline"}
                </IonButton>
              </div>
            </div>
            <div className="admin-notify">
              {/* Rating And Rating Length Component */}
              <Rating
                rating={guruData.total_profile_reviews}
                ratingText={true}
              />

              <IonIcon icon={chatboxEllipsesOutline}></IonIcon>
              <div className="notify-icon">
                <span>1</span>
                <IonIcon icon={notificationsOutline}></IonIcon>
              </div>
            </div>
            <div className="viewers">
              <div className="follower">
                <Link to={"/followers/" + nameParam}>
                  <h5>
                    {guruData.totalfollower != null
                      ? guruData.totalfollower.length
                      : 0}{" "}
                    Followers
                  </h5>
                </Link>
              </div>
              <div className="following">
                <Link to={"/following/" + nameParam}>
                  <h5>
                    {guruData.totalfollowing != null
                      ? guruData.totalfollowing.length
                      : 0}{" "}
                    Following
                  </h5>
                </Link>
              </div>
              <div className="view">
                <h5>
                  {guruData.profile_views != null
                    ? guruData.profile_views.length
                    : 0}{" "}
                  Views
                </h5>
              </div>
              <div className="post">
                <h5>
                  {guruData.posts != null ? guruData.posts.length : 0} Post
                </h5>
              </div>
            </div>

            {/* Complement Component */}
            <Complement division={guruData.total_profile_reviews} />

            <div className="detail-tabs">
              {/* <Link to={"/guru-detail/" + nameParam} className="link"> */}
              <div className="btn">Message</div>
              {/* </Link> */}

              {/* <Link to={"/guru-detail/" + nameParam} className="link"> */}
              <div className="btn active">Reviews</div>
              {/* </Link> */}

              {/* <Link to={"/guru-detail/wall/" + nameParam} className="link"> */}
              <div className="btn">Wall</div>
              {/* </Link> */}

              {/* {getUserData != null ? (
                <Link to={"/guru-detail/info/" + nameParam} className="link"> */}
              <div className="btn">Info</div>
              {/* </Link>
              ) : (
                ""
              )} */}
            </div>
            {/* Footer Navigate bars components */}
            <Navigate />
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};
export default AdminProfile;
