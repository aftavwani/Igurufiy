import React, { useEffect, useState } from "react";
import "./../assets/css/StyleSheet.css";
import { IonButton } from "@ionic/react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import Complement from "../components/Complement";
import { toast, Toaster } from "react-hot-toast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "./LoadingStartCompo";
import AddReviewCompo from "./AddReviewCompo";
import ViewsFormat from "./ViewsFormat";
import ConnectionToast from "./ConnectionToast";

const DetailGrurCompo: React.FC = (prop: any) => {
  const guruData = prop.guruData;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [startLoading, setstartLoading] = useState(false);
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [oFollowBtnClick, setOFollowBtnClick] = useState(false);

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
    if (checkNetwok !== false) {
      logCurrentNetworkStatus();
      prop.axoisFunc();
    } else {
      settoastMessage("Sorry, something went wrong!");
    }
  }, [prop?.nameParam]);

  const followBtn = (e: any) => {
    if (checkNetwok !== false) {
      setOFollowBtnClick(true);
      setstartLoading(true);
      if (e.target.innerText == "Follow") {
        var val = 1;
      } else {
        var val = 0;
      }

      const Url =
        process.env.API_SOME_KEY + "explore-gurus/post/following-page";
      axios
        .post(Url, {
          id: guruData?.id,
          login_user: getUserData?.id,
          check: val,
          page: "detail",
          fcm_token: e.target.token,
        })
        .then(function (response) {
          toast.success(response?.data?.message);
          prop.axoisFunc();
          setstartLoading(false);
          setTimeout(() => {
            setOFollowBtnClick(false);
          }, 1500);
        })
        .catch(function (error) {
          setstartLoading(false);
          setOFollowBtnClick(false);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const myFunc = (parm: any) => {
    const filteredData = prop?.totalFollower.filter((item: any) => {
      return item.id === parm;
    });
    return filteredData.length;
  };

  const [reviewIsOpen, setreviewIsOpen] = useState(false);
  const handleReviewModal = () => {
    setreviewIsOpen(true);
  };

  return (
    <>
      {/* Loading Screen Component */}
      <LoadingStartCompo
        startLoading={startLoading}
        setstartLoading={setstartLoading}
      />

      {/* Add Review Component */}
      {reviewIsOpen === true ? (
        <AddReviewCompo
          reviewIsOpen={reviewIsOpen}
          setreviewIsOpen={setreviewIsOpen}
          checkNetwok={checkNetwok}
          settoastMessage={settoastMessage}
          settoastOpen={settoastOpen}
          guruData={guruData}
          axiosDatta={prop.axoisFunc}
        />
      ) : (
        ""
      )}

      <div className="viewers">
        <div className="follower">
          <Link
            to={
              getUserData !== null
                ? "/followers/" + prop?.nameParam
                : "/guru-detail/" + prop?.nameParam
            }
          >
            <h5>
              {guruData?.totalfollower != null
                ? guruData?.totalfollower.length
                : 0}{" "}
              Followers
            </h5>
          </Link>
        </div>
        <div className="following">
          <Link
            to={
              getUserData !== null
                ? "/following/" + prop?.nameParam
                : "/guru-detail/" + prop?.nameParam
            }
          >
            <h5>
              {guruData != null ? guruData?.totalfollowing?.length : 0}{" "}
              Following
            </h5>
          </Link>
        </div>
        <div className="view">
          <h5>
            <ViewsFormat viewCount={prop.ViewsCount} />
          </h5>
        </div>
        <div className="post">
          <h5>{guruData?.posts != null ? guruData?.posts.length : 0} Post</h5>
        </div>
      </div>

      <Complement division={guruData?.total_profile_reviews} />

      <div className="detail-tabs">
        <div className="inner-tabs">
          <NavLink to={"/guru-detail/" + prop?.nameParam} className="link">
            <div className="btn">Reviews</div>
          </NavLink>
          <NavLink to={"/guru-detail/wall/" + prop?.nameParam} className="link">
            <div className="btn">Activity</div>
          </NavLink>

          {getUserData != null && prop?.nameParam != getUserData?.slug ? (
            <div className="btn" onClick={handleReviewModal}>
              Add Review
            </div>
          ) : (
            ""
          )}
          {/* </div>

        <div className="msg-tabs"> */}
          {getUserData !== null && prop?.nameParam != getUserData?.slug ? (
            <IonButton
              onClick={followBtn}
              token={guruData?.fcm_token}
              className={`btn ${
                myFunc(getUserData?.id) === 1 ? "followingbtn" : " "
              }`}
              mode="md"
              style={{
                textTransform: "capitalize",
              }}
              disabled={oFollowBtnClick}
            >
              {myFunc(getUserData?.id) === 1 ? "Unfollow" : "Follow"}
            </IonButton>
          ) : (
            ""
          )}

          {getUserData !== null ? (
            <NavLink
              to={`/guru-detail/add-message/${prop?.nameParam}/send-message`}
              className="link"
            >
              <div className="btn">Send Message</div>
            </NavLink>
          ) : (
            ""
          )}
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
    </>
  );
};
export default DetailGrurCompo;
