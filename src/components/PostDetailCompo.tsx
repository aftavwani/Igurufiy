import React, { useState } from "react";
import "../assets/css/StyleSheet.css";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonContent,
  IonIcon,
  IonInput,
  useIonToast,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import {
  thumbsUp,
  chatbubbleEllipses,
  shareSocial,
  navigateSharp,
  close,
  checkmarkCircle,
} from "ionicons/icons";
import moment from "moment";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import RepostModal from "./RepostModal";

function PostDetailCompo(prop: any) {
  const [presentToast] = useIonToast();
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const data = prop.postdata;
  const [commentIndex, setcommentIndex] = useState(5);

  const myFunc = (parm: any, likeParm: any) => {
    const filteredData = likeParm.filter((item: any) => {
      return item.user_id === parm;
    });
    return filteredData.length;
  };

  const likeUrl = process.env.API_SOME_KEY + "profile/post/add-like";
  const handleLike = (e: any) => {
    axios
      .post(likeUrl, {
        user_id: getUserData?.id,
        post_id: e.target.getpostid,
        fcm_token: data?.author?.fcm_token,
        post_author_id: data?.author?.id,
      })
      .then(function (response) {
        const filteredData = response?.data?.data?.allPosts.filter(
          (item: any) => {
            return item.id === data.id;
          }
        );

        prop.setpostModalData(filteredData[0]);
        prop.setpostData(response?.data?.data?.allPosts);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [commentVal, setcommentVal] = useState("");
  const handleComment = (e: any) => {
    setcommentVal(e.target.value);
  };

  const commentUrl = process.env.API_SOME_KEY + "profile/post/add-comment";
  const subComment = (e: any) => {
    if (commentVal == "") {
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
          fcm_token: data?.author?.fcm_token,
          post_author_id: data?.author?.id,
        })
        .then(function (response) {
          setcommentVal("");
          const filteredData = response?.data?.data?.allPosts.filter(
            (item: any) => {
              return item.id === data.id;
            }
          );
          prop.setpostModalData(filteredData[0]);
          prop.setpostData(response?.data?.data?.allPosts);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const [repostopen, setrepostopen] = useState(false);
  const [repostModalData, setrepostModalData] = useState({});
  const repostData = () => {
    setrepostopen(true);
    setrepostModalData(data);
  };

  const [commentHide, setcommentHide] = useState("block");

  const handleCommentToggle = () => {
    if (commentHide === "none") {
      setcommentHide("block");
    } else {
      setcommentHide("none");
    }
  };

  const generateItems = () => {
    setcommentIndex(commentIndex + 2);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonModal
        className="linkdin-popup"
        onWillDismiss={() => prop.setMopen(false)}
        isOpen={prop.mopen}
      >
        <IonButtons className="close-btn" slot="start">
          <IonButton onClick={() => prop.setMopen(false)}>
            <IonIcon icon={close}></IonIcon>
          </IonButton>
        </IonButtons>
        <IonContent className="ion-padding">
          <div className="wall-avtar-history">
            <div className="wall-post popup-cntent linkdin-post">
              <div className="avtar-history wall-avtar">
                <div className="upload-client-img">
                  {data?.reposted_post !== null &&
                  data?.reposted_post?.image !== null ? (
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
                  ) : data?.post !== null && data?.image !== null ? (
                    <img
                      src={
                        "https://igurufy.com/storage/app/public/" + data?.image
                      }
                      alt={
                        "https://igurufy.com/storage/app/public/" + data?.image
                      }
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="wall-detail-content">
                  <div className="wall-image">
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

                    <div className="wall-content">
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
                        {moment(data?.created_at).utc().format("D MMM YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="wall-comments">
                  {data.likes?.length > 0 ? (
                    <p className="like-profile">
                      <IonIcon icon={thumbsUp}></IonIcon>
                      {data?.likes?.length > 1
                        ? data?.likes[data?.likes?.length - 1]?.author?.name +
                          " and " +
                          (data?.likes?.length - 1) +
                          " others"
                        : data?.likes[data?.likes?.length - 1]?.author?.name}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <p>
                    {data?.comments?.length} comments ~ {data?.reposts?.length}{" "}
                    Reposts
                  </p>
                </div>
              </div>
              {getUserData !== null ? (
                <div className="like-comments">
                  <p>
                    {" "}
                    <IonIcon
                      style={{
                        color:
                          myFunc(getUserData?.id, data.likes) == 1
                            ? "#922299"
                            : "#d9d9d9",
                      }}
                      onClick={handleLike}
                      getpostid={data.id}
                      icon={thumbsUp}
                    ></IonIcon>{" "}
                    Like
                  </p>
                  <p onClick={handleCommentToggle}>
                    {" "}
                    <IonIcon icon={chatbubbleEllipses}></IonIcon> Comment
                  </p>
                  <p onClick={repostData}>
                    {" "}
                    <IonIcon icon={shareSocial}></IonIcon> Repost
                  </p>
                </div>
              ) : (
                ""
              )}
              <div
                style={{
                  display: commentHide,
                }}
                className="type-comment"
              >
                {getUserData !== null ? (
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
                      <IonButton postId={data.id} onClick={subComment}>
                        <IonIcon icon={navigateSharp}></IonIcon>
                      </IonButton>
                    </div>
                  </form>
                ) : (
                  ""
                )}
                {data != null && data.comments != ""
                  ? data.comments.map((data: any, index: any) =>
                      index < commentIndex ? (
                        <div key={index}>
                          <div className="detail-content  comment-reply">
                            <div className="avtar-image">
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
                              <p>{moment(data?.created_at).fromNow()}</p>
                            </div>
                          </div>
                          <p className="wall-txt">{data?.comment}</p>
                        </div>
                      ) : (
                        ""
                      )
                    )
                  : ""}
              </div>
            </div>
          </div>
          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              generateItems();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonModal>

      <RepostModal
        repostModalData={repostModalData}
        setrepostModalData={setrepostModalData}
        repostopen={repostopen}
        setrepostopen={setrepostopen}
        setpostData={prop.setpostData}
      />
    </>
  );
}

export default PostDetailCompo;
