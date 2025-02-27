import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import imageIndexing from "./../assets/images/imageIndexing";
import Navigate from "../components/navigation/Navigate";
import DetailGrurCompo from "../components/DetailGuruCompo";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/navigation/Header";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import Rating from "../components/Rating";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SocialIcon from "../components/SocialIcon";
import ImageExpandCompo from "../components/ImageExpandCompo";
import PostDetailCompo from "../components/PostDetailCompo";
import UserMenu from "../components/menu/UserMenu";
import { NotifiContext } from "../context/NotifiContext";

const Wall: React.FC = () => {
  const params = useParams();
  const nameParam = params.name;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [imageStyle, setimageStyle] = useState("");
  const Url = `${process.env.API_SOME_KEY}explore-gurus/${nameParam}/wall`;
  const guruDataUrl = process.env.API_SOME_KEY + "explore-guru/" + nameParam;
  const [getPosts, setgetPosts] = useState([]);
  const [getlikes, setgetlikes] = useState([]);
  const [getComments, setgetComments] = useState([]);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [postsIndex, setpostsIndex] = useState(2);
  const [totalFollower, settotalFollower] = useState([]);
  const [guruData, setguruData] = useState({
    avatar: "",
    slug: "",
    ig_username: "",
    tiktok_username: "",
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
  const [guruInfo, setguruInfo] = useState({
    total_profile_reviews: "",
  });
  const [ViewsCount, setViewsCount] = useState(0);
  const [followerCount, setfollowerCount] = useState({
    totalfollower: "",
    totalfollowing: "",
  });
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
      console.log(response?.data?.data?.guru);
      setgetPosts(response?.data?.data?.posts);
      setgetlikes(response?.data?.data?.likedposts);
      setgetComments(response?.data?.data?.commentedposts);

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
      setstartLoading(false);
    });

    axios.get(guruDataUrl).then(function (response) {
      setguruInfo(response?.data?.data?.guru);
      setViewsCount(response?.data?.data?.guru?.profile_views.length);
      setmetaUserData(response?.data?.data?.guru?.usermeta);
      setfollowerCount({
        totalfollower: response?.data?.data?.guru?.totalfollower,
        totalfollowing: response?.data?.data?.guru?.totalfollowing,
      });
      settotalFollower(response?.data?.data?.guru?.totalfollower);
      setstartLoading(false);
    });

    axios
      .get(process.env.API_SOME_KEY + "profile/" + getUserData?.id)
      .then(function (response) {
        setNotifiCount(response?.data?.data?.userData);
      });
  };

  useIonViewWillEnter(() => {
    axios.get(guruDataUrl).then(function (response) {
      setguruInfo(response?.data?.data?.guru);
      setViewsCount(response?.data?.data?.guru?.profile_views.length);
      setmetaUserData(response?.data?.data?.guru?.usermeta);
      setfollowerCount({
        totalfollower: response?.data?.data?.guru?.totalfollower,
        totalfollowing: response?.data?.data?.guru?.totalfollowing,
      });
      settotalFollower(response?.data?.data?.guru?.totalfollower);
    });
  });

  const [mopen, setMopen] = useState(false);
  const [postModalData, setpostModalData] = useState({});
  const handleModal = (data: any) => {
    if (checkNetwok !== false) {
      // if(getUserData !== null)
      setMopen(true);
      setpostModalData(data);
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const generateItems = () => {
    setpostsIndex(postsIndex + 2);
  };

  const [imageIsOpen, setimageIsOpen] = useState(false);
  const handleImageExpand = () => {
    setimageIsOpen(true);
  };

  return (
    <>
      <UserMenu />
      <IonPage id="main-content" className="guru-detail-bg">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section guru-detail-info">
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
                  {guruData.ig_username != null
                    ? guruData.ig_username
                    : guruData.tiktok_username}
                  {guruData?.role_id !== 4 ? (
                    <IonIcon
                      icon={checkmarkCircle}
                      className="name-check-mark"
                    ></IonIcon>
                  ) : (
                    ""
                  )}
                </h2>
                <p>{guruData.name}</p>

                {/* Star Rating And Rating Length Component */}
                <Rating
                  rating={guruInfo?.total_profile_reviews}
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
              guruData={guruInfo}
              nameParam={nameParam}
              totalFollower={totalFollower}
            />

            <div className="wall-avtar-history">
              <h1>Personal</h1>
              {getPosts !== null
                ? getPosts.map((data: any, index: any) =>
                    index < postsIndex ? (
                      <div key={index} className="wall-post">
                        <div className="wall-detail-content">
                          <div className="wall-avtar-image">
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
                            <h2>{data?.name}</h2>
                            <p>
                              {data?.reposted_post === null
                                ? "Creates this post"
                                : "Reposted this post"}
                            </p>
                          </div>
                        </div>

                        <div className="avtar-history wall-avtar">
                          <div className="detail-content">
                            <div className="avtar-image">
                              {data?.reposted_post == null ? (
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
                              ) : (
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
                              )}
                            </div>
                            <div className="avtar-heading">
                              <h2>
                                {data?.reposted_post != null
                                  ? data?.reposted_post?.author?.name
                                  : data?.author?.name}
                              </h2>
                              {/* <p>{data.name}</p> */}
                            </div>
                          </div>
                          <p className="wall-txt">{data?.content}</p>
                          <div
                            className="upload-client-img"
                            onClick={() => handleModal(data)}
                          >
                            {data?.reposted_post == null ? (
                              data?.image != null ? (
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
                              ) : (
                                <div className="blank-space"></div>
                              )
                            ) : data?.reposted_post?.image != null ? (
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
                              <div className="blank-space"></div>
                            )}
                          </div>
                          <div className="comments guru-cmnt">
                            <p>{data?.likes?.length} Likes</p>
                            <p>
                              {data?.comments?.length} comments ~{" "}
                              {data?.reposts?.length} Reposts
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}

              {getlikes != null
                ? getlikes.map((data: any, index: any) =>
                    index < postsIndex ? (
                      <div key={index} className="wall-post">
                        <div className="wall-detail-content">
                          <div className="wall-avtar-image">
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
                            <h2>{data?.post?.name}</h2>
                            <p>Likes this post</p>
                          </div>
                        </div>

                        <div className="avtar-history wall-avtar">
                          <div className="detail-content">
                            <div className="avtar-image">
                              {data?.post?.reposted_post == null ? (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.author?.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.author?.avatar
                                  }
                                />
                              ) : (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.reposted_post.author.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.reposted_post.author.avatar
                                  }
                                />
                              )}
                            </div>
                            <div className="avtar-heading">
                              <h2>
                                {data?.post?.reposted_post != null
                                  ? data?.post?.reposted_post?.author?.name
                                  : data?.post?.author?.name}
                              </h2>
                            </div>
                          </div>
                          <p className="wall-txt">{data?.post?.content}</p>
                          <div
                            className="upload-client-img"
                            onClick={() => handleModal(data?.post)}
                          >
                            {data?.post?.reposted_post == null ? (
                              data?.post?.image != null ? (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.image
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.image
                                  }
                                />
                              ) : (
                                <div className="blank-space"></div>
                              )
                            ) : data?.post?.reposted_post?.image != null ? (
                              <img
                                src={
                                  "https://igurufy.com/storage/app/public/" +
                                  data?.post?.reposted_post?.image
                                }
                                alt={
                                  "https://igurufy.com/storage/app/public/" +
                                  data?.post?.reposted_post?.image
                                }
                              />
                            ) : (
                              <div className="blank-space"></div>
                            )}
                          </div>
                          <div className="comments guru-cmnt">
                            <p>{data?.post?.likes?.length} Likes</p>
                            <p>
                              {data?.post?.comments?.length} comments ~{" "}
                              {data?.post?.reposts?.length} Reposts
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}

              {getComments != null
                ? getComments.map((data: any, index: any) =>
                    index < postsIndex ? (
                      <div key={index} className="wall-post">
                        <div className="wall-detail-content">
                          <div className="wall-avtar-image">
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
                            <h2>{data?.post?.name}</h2>
                            <p>Comment this post</p>
                          </div>
                        </div>

                        <div className="avtar-history wall-avtar">
                          <div className="detail-content">
                            <div className="avtar-image">
                              {data?.post?.reposted_post == null ? (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.author?.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.author?.avatar
                                  }
                                />
                              ) : (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.reposted_post.author.avatar
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.reposted_post.author.avatar
                                  }
                                />
                              )}
                            </div>
                            <div className="avtar-heading">
                              <h2>
                                {data?.post?.reposted_post != null
                                  ? data?.post?.reposted_post?.author?.name
                                  : data?.post?.author?.name}
                              </h2>
                            </div>
                          </div>
                          <p className="wall-txt">{data?.post?.content}</p>
                          <div
                            className="upload-client-img"
                            onClick={() => handleModal(data?.post)}
                          >
                            {data?.post?.reposted_post == null ? (
                              data?.post?.image != null ? (
                                <img
                                  src={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.image
                                  }
                                  alt={
                                    "https://igurufy.com/storage/app/public/" +
                                    data?.post?.image
                                  }
                                />
                              ) : (
                                <div className="blank-space"></div>
                              )
                            ) : data?.post?.reposted_post?.image != null ? (
                              <img
                                src={
                                  "https://igurufy.com/storage/app/public/" +
                                  data?.post?.reposted_post?.image
                                }
                                alt={
                                  "https://igurufy.com/storage/app/public/" +
                                  data?.post?.reposted_post?.image
                                }
                              />
                            ) : (
                              <div className="blank-space"></div>
                            )}
                          </div>
                          <div className="comments guru-cmnt">
                            <p>{data?.post?.likes?.length} Likes</p>
                            <p>
                              {data?.post?.comments?.length} comments ~{" "}
                              {data?.post?.reposts?.length} Reposts
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
          </div>

          {imageIsOpen === true ? (
            <ImageExpandCompo
              imageIsOpen={imageIsOpen}
              setimageIsOpen={setimageIsOpen}
              guruDataAvatar={guruData?.avatar}
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
              setpostData={setgetPosts}
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
export default Wall;
