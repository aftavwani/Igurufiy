import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonPopover,
  IonButton,
  useIonViewWillEnter,
} from "@ionic/react";
import { checkmarkCircle, ellipse, ellipsisHorizontal } from "ionicons/icons";
import { useForm } from "react-hook-form";
import imageIndexing from "./../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { star, happy, flag } from "ionicons/icons";
import DetailGrurCompo from "../components/DetailGuruCompo";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { toast, Toaster } from "react-hot-toast";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import Header from "../components/navigation/Header";
import ReportModal from "../components/ReportModal";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { Link } from "react-router-dom";
import RatingCompo from "../components/Rating";
import ViewsFormat from "../components/ViewsFormat";
import ImageExpandCompo from "../components/ImageExpandCompo";
import SocialIcon from "../components/SocialIcon";
import EditProfileCompo from "../components/EditProfileCompo";
import { NotifiContext } from "../context/NotifiContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import EditReplyCompo from "../components/EditReplyCompo";
import ExpandReviewImage from "../components/ExpandReviewImage";

const GuruDetail: React.FC = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reviewDescription: "",
      imageCapture: "",
      starrating: "",
      complement: "",
    },
  });
  /**
   *
   * @param data
   */

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
    role_id: 0,
    login_status: 0,
  });
  const [reviewerData, setreviewerData] = useState([]);
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
  const [totalFollower, settotalFollower] = useState([]);
  const viewUrl = process.env.API_SOME_KEY + "profile-views/";
  const Url = process.env.API_SOME_KEY + "explore-guru/" + nameParam;
  const deleteReviewUrl =
    process.env.API_SOME_KEY + "explore-gurus/del-review/del";
  const [reviewsIndex, setreviewsIndex] = useState(5);
  const [metaUserData, setmetaUserData] = useState({});
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
        reset();
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
      viewsCountFun();
    } else {
      settoastMessage("Sorry something went wrong!");
    }
  }, [nameParam]);

  const axiosData = async () => {
    setstartLoading(true); // Start loading

    const url = Url; // Ensure Url is defined or passed correctly

    try {
      const response = await axios.get(url);
      const guruData = response?.data?.data?.guru;

      setguruData(guruData);
      setmetaUserData(guruData?.usermeta);
      setViewsCount(guruData?.profile_views?.length);
      setreviewerData(response?.data?.data?.reviews);

      const followerCount = {
        totalfollower: guruData?.totalfollower,
        totalfollowing: guruData?.totalfollowing,
      };
      setfollowerCount(followerCount);
      settotalFollower(guruData?.totalfollower);

      const profileCover = guruData?.usermeta?.profile_cover;
      setimageStyle(
        profileCover
          ? `https://igurufy.com/storage/app/public/${profileCover}`
          : imageIndexing.defaultBanner
      );
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

  const viewsCountFun = async () => {
    await axios.get(Url).then(function (response) {
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
    });
  };

  const [reportIsOpen, setreportIsOpen] = useState(false);
  const [repostData, setrepostData] = useState();
  const [profileUserId, setprofileUserId] = useState("");
  const handleReport = (getData: any) => {
    if (checkNetwok !== false) {
      setreportIsOpen(true);
      setrepostData(getData);
      setprofileUserId(guruData?.id);
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const [helpfulBtn, sethelpfulBtn] = useState(false);
  const helpfulUrl =
    process.env.API_SOME_KEY + "explore-gurus/post/add-helpful-review";
  const handleHelp = async (getData: any) => {
    sethelpfulBtn(true);
    if (checkNetwok !== false) {
      setstartLoading(true);
      if (checkHelpfulRiview(getData?.help_full_reviews) !== 1) {
        await axios
          .post(helpfulUrl, {
            review_id: getData?.id,
            user_id: getUserData?.id,
            profile_id: guruData?.id,
          })
          .then(function (response) {
            axiosData();
            setTimeout(() => {
              sethelpfulBtn(false);
            }, 1500);
          })
          .catch(function (error) {
            console.log(error?.response);
            sethelpfulBtn(false);
          });
      } else {
        sethelpfulBtn(false);
      }
      setstartLoading(false);
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
      sethelpfulBtn(false);
    }
  };

  const checkHelpfulRiview = (helpfullData: any) => {
    const filteredData = helpfullData.filter((item: any) => {
      return item.login_user_id == getUserData?.id;
    });
    return filteredData.length;
  };

  const generateItems = () => {
    setreviewsIndex(reviewsIndex + 5);
  };

  const [imageIsOpen, setimageIsOpen] = useState(false);
  const handleImageExpand = () => {
    setimageIsOpen(true);
  };

  /* Delete Review Start */
  const handleReviewDelete = async (event: any) => {
    await axios
      .post(deleteReviewUrl, {
        id: event?.id,
        user_id: event?.user_id,
      })
      .then(function (response) {
        axiosData();
        setTimeout(() => {
          toast.success(response?.data?.message);
        }, 1000);
      })
      .catch(function (error) {
        console.log(error?.response?.data);
      });
  };
  /* Delete Review End */

  /* Edit Review Start */
  const [EditIsOpen, setEditIsOpen] = useState(false);
  const [EditProfileData, setEditProfileData] = useState({});
  const handlePostEdit = (event: any) => {
    setEditIsOpen(true);
    setEditProfileData(event);
  };
  /* Edit Review End */

  /* Edit Reply Start */
  const [editReplyIsOpen, seteditReplyIsOpen] = useState(false);
  const [editReplyData, seteditReplyData] = useState({});
  const handleEditReply = (event: any) => {
    if (getUserData?.id === event?.user_id) {
      seteditReplyIsOpen(true);
      seteditReplyData(event);
    }
  };
  /* Edit Reply Start */

  const [reviewImgOpen, setreviewImgOpen] = useState(false);
  const [reviewImgData, setreviewImgData] = useState("");
  const handleReviewImage = (data: any) => {
    setreviewImgOpen(true);
    setreviewImgData(data);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="guru-detail-bg">
        {/* Header Component */}
        <Header />

        <IonContent
          fullscreen
          className="top-section guru-report guru-detail-info"
        >
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
          ></div>
          <div className="gurus-profile">
            <div className="avtar-info main-sec-content">
              <div className="avtar-img info-avtar-img">
                <img
                  src={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  alt={
                    "https://igurufy.com/storage/app/public/" + guruData?.avatar
                  }
                  width="50%"
                  onClick={handleImageExpand}
                />
                <p>{guruData?.login_status === 1 ? "Online" : "Offline"}</p>
              </div>
              <div className="avtar-cntnt">
                <h2>
                  @
                  {guruData?.ig_username != null
                    ? guruData?.ig_username
                    : guruData?.tiktok_username}
                  {guruData?.role_id !== 4 ? (
                    <IonIcon
                      icon={checkmarkCircle}
                      className="name-check-mark"
                    ></IonIcon>
                  ) : (
                    ""
                  )}
                </h2>

                <p>{guruData?.name}</p>
                {/* Star Rating And Rating Length Component */}
                <RatingCompo
                  rating={guruData?.total_profile_reviews}
                  ratingText={true}
                />
              </div>
              {/* Social Icon Data Componente */}
              <SocialIcon metaUserData={metaUserData} guruData={guruData} />
            </div>

            {/* Header Data Componente */}
            <DetailGrurCompo
              axoisFunc={axiosData}
              ViewsCount={ViewsCount}
              guruData={guruData}
              nameParam={nameParam}
              totalFollower={totalFollower}
            />

            {reviewerData.length != 0
              ? reviewerData.map((getData: any, index: any) =>
                  index < reviewsIndex ? (
                    <div
                      key={index}
                      className="avtar-history review-sec"
                      style={{
                        minHeight:
                          getData?.review_replies !== null ? "445px" : "360px",
                      }}
                    >
                      <div className="wall-detail-content ellipse">
                        <div className="wall-follow">
                          <IonIcon
                            id={
                              (guruData?.id == getUserData?.id &&
                                getData?.profile_author?.id !=
                                  getUserData?.id) ||
                              getData?.profile_author?.id == getUserData?.id
                                ? "action-trigger-" + getData?.id
                                : ""
                            }
                            icon={ellipsisHorizontal}
                          ></IonIcon>
                          <IonPopover
                            trigger={"action-trigger-" + getData?.id}
                            dismissOnSelect={true}
                            size={25}
                          >
                            <IonContent>
                              <IonList>
                                {getData?.profile_author?.id ==
                                getUserData?.id ? (
                                  <>
                                    <IonItem
                                      onClick={() => handlePostEdit(getData)}
                                      button={true}
                                      detail={false}
                                    >
                                      Edit
                                    </IonItem>
                                    <IonItem
                                      onClick={() =>
                                        handleReviewDelete(getData)
                                      }
                                      button={true}
                                      detail={false}
                                    >
                                      Delete
                                    </IonItem>
                                  </>
                                ) : guruData?.id == getUserData?.id &&
                                  getData?.profile_author?.id !=
                                    getUserData?.id ? (
                                  <IonItem
                                    onClick={() => handleEditReply(getData)}
                                    button={true}
                                    detail={false}
                                  >
                                    Reply
                                  </IonItem>
                                ) : (
                                  ""
                                )}
                              </IonList>
                            </IonContent>
                          </IonPopover>
                        </div>
                      </div>

                      <div className="detail-content">
                        <div className="profile-avtar-img avtar-image">
                          <Link
                            to={"/guru-detail/" + getData?.profile_author?.slug}
                          >
                            <img
                              src={
                                "https://igurufy.com/storage/app/public/" +
                                getData?.profile_author?.avatar
                              }
                              alt={
                                "https://igurufy.com/storage/app/public/" +
                                getData?.profile_author?.avatar
                              }
                              width="50%"
                            />
                          </Link>
                        </div>
                        <div
                          className="profile-avtar-content avtar-cntnt"
                          style={{ paddingLeft: "15px" }}
                        >
                          <h2>{getData?.profile_author?.name}</h2>
                          <p>
                            {moment(getData?.created_at)
                              .utc()
                              .format("MMMM D, YYYY")}
                          </p>
                        </div>
                        <div className="profile-avtar-rating">
                          <IonIcon
                            color={getData?.rating >= 1 ? "warning" : "medium"}
                            icon={star}
                          ></IonIcon>
                          <IonIcon
                            color={getData?.rating >= 2 ? "warning" : "medium"}
                            icon={star}
                          ></IonIcon>
                          <IonIcon
                            color={getData?.rating >= 3 ? "warning" : "medium"}
                            icon={star}
                          ></IonIcon>
                          <IonIcon
                            color={getData?.rating >= 4 ? "warning" : "medium"}
                            icon={star}
                          ></IonIcon>
                          <IonIcon
                            color={getData?.rating >= 5 ? "warning" : "medium"}
                            icon={star}
                          ></IonIcon>
                        </div>
                      </div>
                      <p className="avtar-txt avtar-height">
                        {getData?.description}
                      </p>
                      <div className="client-upload">
                        {getData?.image != null ? (
                          getData?.image
                            .split("|")
                            .map((data: any, index: any) => (
                              <img
                                src={
                                  "https://igurufy.com/public/reviews/" + data
                                }
                                key={index}
                                onClick={() =>
                                  handleReviewImage(getData?.image)
                                }
                              />
                            ))
                        ) : (
                          <div className="no-found"></div>
                        )}
                      </div>

                      {getData?.review_replies !== null ? (
                        <div className="gurus-reply">
                          <div className="detail-content guru-response">
                            <div className="profile-avtar-img avtar-image">
                              <Link to={"/guru-detail/" + guruData?.slug}>
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    guruData?.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    guruData?.avatar
                                  }
                                  width="50%"
                                />
                              </Link>
                            </div>
                            <div
                              className="profile-avtar-content avtar-cntnt"
                              style={{ paddingLeft: "15px" }}
                            >
                              <h2>
                                {guruData?.name}
                                {guruData?.role_id !== 4 ? (
                                  <IonIcon
                                    icon={checkmarkCircle}
                                    className="name-check-mark"
                                  ></IonIcon>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <p>
                                {moment(getData?.review_replies?.created_at)
                                  .utc()
                                  .format("MMMM D, YYYY")}
                              </p>
                            </div>
                            <h5>
                              {guruData?.role_id === 1
                                ? "Admin Response"
                                : guruData?.role_id === 3 ||
                                  guruData?.role_id === 5
                                ? "Guru Response"
                                : guruData?.role_id === 4
                                ? "Reviewer Response"
                                : "User Response"}
                            </h5>
                          </div>
                          <p
                            className="reply-description"
                            onClick={() => handleEditReply(getData)}
                          >
                            {getData?.review_replies?.description}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      <p className="description">
                        {getData?.help_full_reviews?.length} people found this
                        review helpful
                      </p>
                      {getUserData !== null ? (
                        <div className="helpful-review">
                          <IonButton
                            onClick={() => handleHelp(getData)}
                            className="helpful-btn-icon"
                            disabled={helpfulBtn}
                          >
                            <IonIcon
                              style={{
                                color:
                                  checkHelpfulRiview(
                                    getData?.help_full_reviews
                                  ) === 1
                                    ? "#932298"
                                    : "#7b7b7b",
                              }}
                              slot="start"
                              icon={happy}
                            ></IonIcon>
                            <IonText className="helpful-text">Helpful </IonText>
                          </IonButton>

                          <IonButton
                            className="helpful-btn-icon report-text"
                            onClick={() => handleReport(getData)}
                          >
                            <IonIcon
                              icon={flag}
                              className="report-text"
                              slot="start"
                            ></IonIcon>
                            <IonText className="helpful-text">Report</IonText>
                          </IonButton>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )
                )
              : ""}
          </div>

          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              generateItems();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>

          {imageIsOpen === true ? (
            <ImageExpandCompo
              imageIsOpen={imageIsOpen}
              setimageIsOpen={setimageIsOpen}
              guruDataAvatar={guruData?.avatar}
            />
          ) : (
            ""
          )}

          {/* Expand Review Image Modal */}
          {reviewImgOpen === true ? (
            <ExpandReviewImage
              reviewImgOpen={reviewImgOpen}
              setreviewImgOpen={setreviewImgOpen}
              reviewImgData={reviewImgData}
              setreviewImgData={setreviewImgData}
            />
          ) : (
            ""
          )}

          {/* Edit Review components */}
          {EditIsOpen === true ? (
            <EditProfileCompo
              EditProfileData={EditProfileData}
              setEditProfileData={setEditProfileData}
              EditIsOpen={EditIsOpen}
              setEditIsOpen={setEditIsOpen}
              setreviewerData={setreviewerData}
            />
          ) : (
            ""
          )}

          {/* Edit Reply components */}
          {editReplyIsOpen === true ? (
            <EditReplyCompo
              editReplyData={editReplyData}
              seteditReplyData={seteditReplyData}
              editReplyIsOpen={editReplyIsOpen}
              seteditReplyIsOpen={seteditReplyIsOpen}
              setreviewerData={setreviewerData}
              axiosData={axiosData}
            />
          ) : (
            ""
          )}

          {/* Report Modal components */}
          {reportIsOpen === true ? (
            <ReportModal
              setreportIsOpen={setreportIsOpen}
              reportIsOpen={reportIsOpen}
              repostData={repostData}
              profileUserId={profileUserId}
            />
          ) : (
            ""
          )}

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
export default GuruDetail;
