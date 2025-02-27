import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonTextarea,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { close, checkmarkCircle } from "ionicons/icons";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";

function RepostModal(prop: any) {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [repostCapModal, setrepostCapModal] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      body: "",
      post_id: "",
    },
  });
  /**
   *
   * @param data
   */

  const data = prop.repostModalData;

  const handleRpostCaption = (e: any) => {
    prop.setrepostopen(false);
    setrepostCapModal(true);
  };

  const repostUrl = process.env.API_SOME_KEY + "profile/post/repost";
  const handleRpost = (e: any) => {
    axios
      .post(repostUrl, {
        user_id: getUserData?.id,
        post_id: e.target.postid,
        reposttype: "simple",
        fcm_token: data?.author?.fcm_token,
      })
      .then(function (response) {
        prop.setrepostopen(false);
        prop.setpostData(response?.data?.data?.allPosts);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCapModal = () => {
    setrepostCapModal(false);
  };

  const [bodyText, setbodyText] = useState("");
  const haldleBody = (e: any) => {
    setbodyText(e.target.value);
  };

  const submitBtn = (e: any) => {
    axios
      .post(repostUrl, {
        user_id: getUserData?.id,
        post_id: e.target.postid,
        repostedbody: bodyText,
        reposttype: "caption",
        fcm_token: data?.author?.fcm_token,
      })
      .then(function (response) {
        setrepostCapModal(false);
        setbodyText("");
        prop.setpostData(response?.data?.data?.allPosts);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleModalOf = () => {
    prop.setrepostopen(false);
    reset();
  };

  return (
    <>
      <IonModal
        initialBreakpoint={1}
        breakpoints={[0, 1]}
        className="repost-modal"
        isOpen={prop.repostopen}
        onWillDismiss={handleModalOf}
      >
        <div className="repost-block">
          <IonButton
            // id={"repost-caption-modal" + data.id}
            postid={data.id}
            onClick={handleRpostCaption}
          >
            Repost & Caption
          </IonButton>
          <IonButton postid={data.id} onClick={handleRpost}>
            Repost
          </IonButton>
        </div>
      </IonModal>

      <IonModal isOpen={repostCapModal} keepContentsMounted={true}>
        <IonHeader>
          <IonToolbar>
            <IonButtons className="close-btn" slot="end">
              <IonButton onClick={handleCapModal}>
                <IonIcon icon={close}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle>Share</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form>
            <IonLabel color="dark">Body</IonLabel>
            <IonTextarea
              {...register("body")}
              className="custom"
              name="body"
              placeholder="Write Something..."
              onInput={haldleBody}
            ></IonTextarea>

            {data?.reposted_post != null ? (
              <div className="mid-section">
                <div className="detail-content">
                  <div className="avtar-image">
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
                  </div>
                  <div className="avtar-heading">
                    <h2>
                      {data?.reposted_post?.author?.name}
                      {data?.reposted_post?.author?.role_id !== 4 ? (
                        <IonIcon
                          icon={checkmarkCircle}
                          className="name-check-mark"
                        ></IonIcon>
                      ) : (
                        ""
                      )}
                    </h2>
                    <p>
                      {moment(data?.reposted_post?.created_at)
                        .utc()
                        .format("D MMM YYYY")}
                    </p>
                  </div>
                </div>
                <p className="wall-txt">{data?.reposted_post?.content}</p>
                <div className="upload-client-img">
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
              <div className="mid-section">
                <div className="detail-content">
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
                    <p>{moment(data?.created_at).utc().format("D MMM YYYY")}</p>
                  </div>
                </div>
                <p className="wall-txt">{data?.content}</p>
                <div className="upload-client-img">
                  {data?.image != null ? (
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
              </div>
            )}

            <IonButton
              postid={data.id}
              onClick={submitBtn}
              expand="block"
              className="submit"
            >
              Post
            </IonButton>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
}

export default RepostModal;
