import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonText,
  IonInput,
  IonLabel,
  IonButton,
  IonTextarea,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonToast,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import Navigate from "../components/navigation/Navigate";
import {
  add,
  remove,
  thumbsUp,
  chatbubbleEllipses,
  shareSocial,
  chatboxEllipsesOutline,
  notificationsOutline,
  linkOutline,
  navigateSharp,
  ellipsisHorizontal,
  checkmarkCircle,
} from "ionicons/icons";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import Header from "../components/navigation/Header";
import moment from "moment";
import PostDetailCompo from "../components/PostDetailCompo";
import RepostModal from "../components/RepostModal";
import { Clipboard } from "@capacitor/clipboard";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import UserMenu from "../components/menu/UserMenu";
import { NotifiContext } from "../context/NotifiContext";

const Profile: React.FC = () => {
  const [presentToast] = useIonToast();
  const getUserData = JSON.parse(localStorage.getItem("userData"));

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
  const copybtn = async () => {
    var copyText = document.getElementById("myInput");
    let val = "https://igurufy.com/explore-guru/" + copyText?.value;
    try {
      await Clipboard.write({
        string: val,
      });
      const { type, value } = await Clipboard.read();
    } catch (err) {
      toast.error("Copy to clipboard failed.");
    }
  };
  const Url = process.env.API_SOME_KEY + "profile/" + getUserData?.id;
  const [userData, setuserData] = useState({
    username: "",
    ig_username: "",
    tiktok_username: "",
    name: "",
    total_profile_reviews: "",
    unread_notifications: "",
    unread_messages: "",
    following: [],
  });
  const [postData, setpostData] = useState([]);
  const [followFilter, setfollowFilter] = useState([]);
  const [profileBanner, setprofileBanner] = useState("");
  const [startLoading, setstartLoading] = useState(false);
  const [postsIndex, setpostsIndex] = useState(10);
  const { setNotifiCount } = useContext(NotifiContext);

  const generateItems = () => {
    setpostsIndex(postsIndex + 10);
  };

  const checkFollow = (parm: any, loginId: any) => {
    const filteredData = followFilter.filter((item: any) => {
      return item.follow_user_id === parm && item.login_user_id === loginId;
    });
    return filteredData.length;
  };

  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");

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
      // Any calls to load data go here
      if (checkNetwok !== false) {
        axiosData();
        setformHide("none");
        setbtnIcon(add);
        reset();
        setimageCapture(null);
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
      settoastMessage("Sorry, something went wrong!");
    }
  }, []);

  const axiosData = () => {
    setstartLoading(true);
    axios.get(Url).then(function (response) {
      setuserData(response?.data?.data?.userData);
      setNotifiCount(response?.data?.data?.userData);
      setfollowFilter(response?.data?.data?.userData?.following);
      setpostData(response?.data?.data?.allPosts);

      if (
        response?.data?.data?.userData?.usermeta !== null &&
        response?.data?.data?.userData?.usermeta?.profile_cover !== null &&
        response?.data?.data?.userData?.usermeta?.profile_cover !== ""
      ) {
        setprofileBanner(
          `https://igurufy.com/storage/app/public/${response?.data?.data?.userData?.usermeta?.profile_cover}`
        );
      } else {
        setprofileBanner(imageIndexing.defaultBanner);
      }
      setstartLoading(false);
    });
  };

  const [imageCapture, setimageCapture] = useState<any>(null);
  const handleFileSelect = async (e: any) => {
    e.preventDefault();
    setimageCapture(e.target.files[0]);
  };

  const addPostUrl = process.env.API_SOME_KEY + "profile/post/add-post";
  const submitBtn = async (data: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("image", imageCapture);
      formData.append("user_id", getUserData?.id);

      await axios({
        method: "post",
        url: addPostUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          reset();
          setimageCapture(null);
          toast.success(response?.data?.message);
          setstartLoading(false);
          setformHide("none");
          setbtnIcon(add);
          axiosData();
        })
        .catch(function (error) {
          toast.error(error?.response?.data?.message);
          console.log(error?.response?.data);
          setstartLoading(false);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const myFunc = (parm: any, likeParm: any) => {
    const filteredData = likeParm.filter((item: any) => {
      return item.user_id === parm;
    });
    return filteredData.length;
  };

  const [commentVal, setcommentVal] = useState("");
  const handleComment = (e: any) => {
    setcommentVal(e.target.value);
  };

  const commentUrl = process.env.API_SOME_KEY + "profile/post/add-comment";
  const subComment = (e: any) => {
    if (checkNetwok !== false) {
      if (commentVal === "") {
        presentToast({
          message: "Please Add Comment!",
          duration: 2000,
          position: "top",
          color: "commentToast",
        });
      } else {
        axios
          .post(commentUrl, {
            user_id: getUserData?.id,
            post_id: e.target.postId,
            comment: commentVal,
            fcm_token: e.target.token,
            post_author_id: e.target.postAuthorId,
          })
          .then(function (response) {
            setcommentVal("");
            setpostData(response?.data?.data?.allPosts);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const likeUrl = process.env.API_SOME_KEY + "profile/post/add-like";
  const handleLike = (event: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      axios
        .post(likeUrl, {
          user_id: getUserData?.id,
          post_id: event?.id,
          fcm_token: event?.author?.fcm_token,
          post_author_id: event?.author?.id,
        })
        .then(function (response) {
          setpostData(response?.data?.data?.allPosts);
          setstartLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setstartLoading(false);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const [mopen, setMopen] = useState(false);
  const [postModalData, setpostModalData] = useState({});
  const handleModal = (data: any) => {
    if (checkNetwok !== false) {
      setMopen(true);
      setpostModalData(data);
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const [repostopen, setrepostopen] = useState(false);
  const [repostModalData, setrepostModalData] = useState({});
  const repostData = (data: any) => {
    if (checkNetwok !== false) {
      setrepostopen(true);
      setrepostModalData(data);
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const haldleFollowing = async (e: any) => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      if (e.target.innerText == "FOLLOW") {
        var val = 1;
      } else {
        var val = 0;
      }

      // console.log('id:', e.target.userid , 'login_user:', getUserData?.id, 'check:', val)
      //  return false

      const Url = `${process.env.API_SOME_KEY}explore-gurus/post/following-page`;
      await axios
        .post(Url, {
          id: e.target.userid,
          login_user: getUserData?.id,
          check: val,
          page: "following",
          fcm_token: e.target.token,
        })
        .then(function (response) {
          setfollowFilter(response?.data?.data?.data?.totalfollowing);
          toast.success(response?.data?.message);
          axiosData();
          setstartLoading(false);
        })
        .catch(function (error) {
          setstartLoading(false);
          console.log(error?.response?.data);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const [commentHide, setcommentHide] = useState("none");
  const [commentId, setcommentId] = useState("");

  const handleCommentToggle = (data: any) => {
    if (commentHide === "none") {
      setcommentId(data?.id);
      setcommentHide("block");
    } else {
      if (commentId == data?.id) {
        setcommentHide("none");
      } else {
        setcommentHide("none");
        if (commentId != data?.id) {
          setcommentId(data?.id);
          setcommentHide("block");
        }
      }
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color admin-page">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
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

          <div className="linkdin-top-sec">
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
                    "https://igurufy.com/storage/app/public/" +
                    getUserData?.avatar
                  }
                  alt={
                    "https://igurufy.com/storage/app/public/" +
                    getUserData?.avatar
                  }
                />
              </div>

              <div className="admin-home">
                <div className="admin-bio">
                  <h2>
                    @
                    {userData?.username != null
                      ? userData?.username
                      : userData?.ig_username != null
                      ? userData?.ig_username
                      : userData?.tiktok_username != null
                      ? userData?.tiktok_username
                      : ""}
                  </h2>
                  <p>{userData?.name}</p>
                </div>
                <div className="admin-btn">
                  <span>
                    {getUserData?.login_status === 1 ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="admin-notify">
                <div className="five-star">
                  {/* Rating And Rating Length Component */}
                  <Rating
                    rating={userData?.total_profile_reviews}
                    ratingText={true}
                  />
                </div>
                <div className="info-icon">
                  <div onClick={copybtn}>
                    <IonIcon className="copy-link" icon={linkOutline}></IonIcon>
                    <IonText className="user-txt">{getUserData?.name}</IonText>
                    <input
                      type="hidden"
                      id="myInput"
                      value={getUserData?.slug}
                    />
                  </div>
                  <Link to="/message">
                    <div className="notify-icon">
                      <IonIcon icon={chatboxEllipsesOutline}></IonIcon>
                    </div>
                  </Link>

                  <Link to="/notification">
                    <div className="notify-icon">
                      <IonIcon icon={notificationsOutline}></IonIcon>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="admin-post">
                <IonButton
                  onClick={formToggel}
                  className="add-btn"
                  expand="full"
                >
                  <IonIcon slot="start" icon={btnIcon}></IonIcon>
                  Add New Post
                </IonButton>
                <form
                  style={{ display: formHide }}
                  onSubmit={handleSubmit(submitBtn)}
                >
                  <IonLabel color="dark">Title</IonLabel>
                  <IonInput
                    {...register("title", {
                      required: "Title is a required",
                    })}
                    className="custom"
                    name="title"
                  ></IonInput>
                  <ErrorMessage
                    errors={errors}
                    name="title"
                    as={<div className="error" />}
                  />

                  <IonLabel color="dark">Body</IonLabel>
                  <IonTextarea
                    {...register("body", {
                      required: "Body is a required",
                    })}
                    className="custom"
                    name="body"
                  ></IonTextarea>
                  <ErrorMessage
                    errors={errors}
                    name="body"
                    as={<div className="error" />}
                  />

                  <IonLabel color="dark">Image</IonLabel>
                  <label
                    htmlFor="file-upload-image"
                    className="custom-file-upload"
                  >
                    {imageCapture != null
                      ? imageCapture?.name
                      : "No choosen file"}
                  </label>
                  <input
                    {...register("postImage")}
                    id="file-upload-image"
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    name="postImage"
                    className="hide-images"
                  />

                  <IonButton expand="block" className="submit" type="submit">
                    Save
                  </IonButton>
                </form>
              </div>
            </div>
            {/* Complement Component */}

            {postData != null
              ? postData.map((data: any, index: any) =>
                  index < postsIndex ? (
                    <div className="wall-avtar-history" key={index}>
                      <div className="wall-post linkdin-post">
                        <div className="wall-detail-content ellipse">
                          <div className="wall-follow">
                            <IonIcon icon={ellipsisHorizontal}></IonIcon>
                          </div>
                        </div>
                        <div className="avtar-history wall-avtar">
                          <div className="detail-content">
                            <div className="avtar-image">
                              <Link to={"/guru-detail/" + data?.author?.slug}>
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.author?.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.author?.avatar
                                  }
                                />
                              </Link>
                            </div>
                            <div className="avtar-heading">
                              <h2>
                                {data?.author?.name}

                                {data?.author?.role_id !== 4 ? (
                                  <IonIcon
                                    icon={checkmarkCircle}
                                    className="name-check-mark"
                                  ></IonIcon>
                                ) : (
                                  ""
                                )}
                              </h2>
                              <p>
                                {moment(data?.created_at)
                                  .utc()
                                  .format("D MMM YYYY")}
                              </p>
                            </div>

                            <div className="wall-follow">
                              <h5>
                                {getUserData?.id != data?.author?.id ? (
                                  <IonButton
                                    className="ion-text-uppercase"
                                    userid={data?.author?.id}
                                    token={data?.author?.fcm_token}
                                    onClick={(e) => haldleFollowing(e)}
                                  >
                                    {checkFollow(
                                      data?.author?.id,
                                      getUserData?.id
                                    ) === 1
                                      ? "Unfollow"
                                      : "Follow"}
                                  </IonButton>
                                ) : (
                                  ""
                                )}
                              </h5>
                            </div>
                          </div>
                          <p className="wall-txt">{data?.content}</p>

                          {data?.reposted_post != null ? (
                            <div className="mid-section">
                              <div className="detail-content">
                                <div className="avtar-image">
                                  <Link
                                    to={
                                      "/guru-detail/" +
                                      data?.reposted_post?.author?.slug
                                    }
                                  >
                                    <img
                                      src={
                                        "https://igurufy.com/storage/app/public/" +
                                        data?.reposted_post?.author?.avatar
                                      }
                                      alt={
                                        "https://igurufy.com/storage/app/public/" +
                                        data?.reposted_post?.author?.avatar
                                      }
                                    />
                                  </Link>
                                </div>
                                <div className="avtar-heading">
                                  <h2>{data?.reposted_post?.author?.name}</h2>
                                  <p>
                                    {moment(data?.reposted_post?.created_at)
                                      .utc()
                                      .format("D MMM YYYY")}
                                  </p>
                                </div>

                                <div className="wall-follow">
                                  {getUserData?.id !=
                                  data?.reposted_post?.author?.id ? (
                                    <IonButton
                                      className="ion-text-uppercase"
                                      userid={data?.reposted_post?.author?.id}
                                      token={
                                        data?.reposted_post?.author?.fcm_token
                                      }
                                      onClick={(e) => haldleFollowing(e)}
                                    >
                                      {checkFollow(
                                        data?.reposted_post?.author?.id,
                                        getUserData?.id
                                      ) == 1
                                        ? "Unfollow"
                                        : "Follow"}
                                    </IonButton>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <p className="wall-txt">
                                {data?.reposted_post?.content}
                              </p>
                              <div
                                onClick={() => handleModal(data)}
                                className="upload-client-img"
                              >
                                {data?.reposted_post?.image != null ? (
                                  <img
                                    src={
                                      "https://igurufy.com/storage/app/public/" +
                                      data?.reposted_post?.image
                                    }
                                    alt={
                                      "https://igurufy.com/storage/app/public/" +
                                      data?.reposted_post?.image
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {data?.image != null ? (
                            <div
                              onClick={() => handleModal(data)}
                              className="upload-client-img"
                            >
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
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="wall-comments">
                            {data.likes?.length > 0 ? (
                              <p className="like-profile">
                                <IonIcon icon={thumbsUp}></IonIcon>
                                {data?.likes?.length > 1
                                  ? data?.likes[data?.likes?.length - 1]?.author
                                      ?.name +
                                    " and " +
                                    (data?.likes?.length - 1) +
                                    " others"
                                  : data?.likes[data?.likes?.length - 1]?.author
                                      ?.name}
                              </p>
                            ) : (
                              <p></p>
                            )}
                            <p onClick={() => handleModal(data)}>
                              {data?.comments?.length} comments ~{" "}
                              {data?.reposts?.length} Reposts
                            </p>
                          </div>
                        </div>
                        <div className="like-comments">
                          <p onClick={() => handleLike(data)}>
                            {" "}
                            <IonIcon
                              style={{
                                color:
                                  myFunc(getUserData?.id, data.likes) == 1
                                    ? "#922299"
                                    : "#d9d9d9",
                              }}
                              icon={thumbsUp}
                            ></IonIcon>{" "}
                            Like
                          </p>
                          <p onClick={() => handleCommentToggle(data)}>
                            {" "}
                            <IonIcon icon={chatbubbleEllipses}></IonIcon>{" "}
                            Comment
                          </p>
                          <p
                            onClick={() => repostData(data)}
                            id={"repost-modal-" + data?.id}
                          >
                            {" "}
                            <IonIcon icon={shareSocial}></IonIcon> Repost
                          </p>
                        </div>
                        <div
                          style={{
                            display:
                              commentId == data?.id ? commentHide : "none",
                          }}
                          className="type-comment"
                        >
                          <form>
                            <img
                              src={
                                "https://igurufy.com/storage/app/public/" +
                                getUserData?.avatar
                              }
                              alt={
                                "https://igurufy.com/storage/app/public/" +
                                getUserData?.avatar
                              }
                            />
                            <div className="input-msg">
                              <IonInput
                                value={commentVal}
                                onIonInput={handleComment}
                                placeholder="Leave your comment here"
                              />
                              <IonButton
                                postId={data?.id}
                                postAuthorId={data?.author?.id}
                                token={data?.author?.fcm_token}
                                onClick={subComment}
                              >
                                <IonIcon icon={navigateSharp}></IonIcon>
                              </IonButton>
                            </div>
                          </form>
                          {data.comments != "" ? (
                            <div>
                              <div className="detail-content  comment-reply">
                                <div className="avtar-image">
                                  <img
                                    src={
                                      "https://igurufy.com/storage/app/public/" +
                                      data?.comments[0]?.author?.avatar
                                    }
                                    alt={
                                      "https://igurufy.com/storage/app/public/" +
                                      data?.comments[0]?.author?.avatar
                                    }
                                  />
                                </div>
                                <div className="avtar-heading">
                                  <h2>
                                    {data?.comments[0]?.author?.name}
                                    {data?.comments[0]?.author?.role_id !==
                                    4 ? (
                                      <IonIcon
                                        icon={checkmarkCircle}
                                        className="name-check-mark"
                                      ></IonIcon>
                                    ) : (
                                      ""
                                    )}
                                  </h2>
                                  <p>
                                    {moment(
                                      data?.comments[0]?.created_at
                                    ).fromNow()}
                                  </p>
                                </div>
                              </div>
                              <p className="wall-txt reply-cmnt-bg">
                                {data?.comments[0]?.comment}
                              </p>
                              {data?.comments.length > 1 ? (
                                <IonText
                                  onClick={() => handleModal(data)}
                                  className="load-more-comment"
                                >
                                  Load more
                                </IonText>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )
              : ""}

            {/* Repost Modal */}
            {repostModalData != null ? (
              <RepostModal
                repostModalData={repostModalData}
                setrepostModalData={setrepostModalData}
                repostopen={repostopen}
                setrepostopen={setrepostopen}
                setpostData={setpostData}
              />
            ) : (
              ""
            )}

            {/* Detail Modal components */}
            {mopen == true ? (
              <PostDetailCompo
                postdata={postModalData}
                setpostModalData={setpostModalData}
                mopen={mopen}
                setMopen={setMopen}
                setpostData={setpostData}
              />
            ) : (
              ""
            )}
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

          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              generateItems();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>

        {/* Footer Navigate bars components */}
        <Navigate />
      </IonPage>
    </>
  );
};
export default Profile;
