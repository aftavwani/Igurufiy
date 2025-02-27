import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonContent,
  IonToolbar,
  useIonToast,
  IonLabel,
  createAnimation,
  IonRadioGroup,
  IonRadio,
  IonTextarea,
  IonIcon,
} from "@ionic/react";
import { close, information } from "ionicons/icons";
import imageIndexing from "../assets/images/imageIndexing";
import { Rating } from "react-simple-star-rating";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import LoadingStartCompo from "./LoadingStartCompo";

function AddReviewCompo(prop: any) {
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

  /*  Modal Animation Start */
  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector("ion-backdrop")!)
      .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector(".modal-wrapper")!)
      .keyframes([
        { offset: 0, opacity: "0", transform: "scale(0)" },
        { offset: 1, opacity: "0.99", transform: "scale(1)" },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing("ease-out")
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction("reverse");
  };
  /*  Modal Animation End */

  const params = useParams();
  const nameParam = params.name;
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const [presentToast] = useIonToast();
  const reviewUrl = process.env.API_SOME_KEY + "explore-gurus/add-review/add";
  const [starRating, setstarRating] = useState(0);
  const [complementVal, setcomplementVal] = useState("");
  const [textReviewVal, settextReviewVal] = useState("");
  const [captureImageData, setcaptureImageData] = useState([]);
  const [startLoading, setstartLoading] = useState(false);

  const handleModalOff = () => {
    prop.setreviewIsOpen(false);
    setstarRating(0);
    reset();
  };

  const handleRating = (rate: any) => {
    setstarRating(rate);
  };

  const handleComplement = (e: any) => {
    setcomplementVal(e.target.value);
  };

  const textReview = (e: any) => {
    settextReviewVal(e.target.value);
  };

  const [imageTextName, setImageTextName] = useState("Choose File");
  const handleImageCapture = (e: any) => {
    setcaptureImageData(e.target.files);
    setImageTextName(
      e.target.files.length == "1"
        ? e.target.files[0].name
        : e.target.files.length + " files"
    );
  };

  const submitBtn = (data: any) => {
    if (prop.checkNetwok !== false) {
      if (starRating < 1) {
        presentToast({
          message: "Please Select Stars!",
          duration: 2000,
          position: "top",
          color: "commentToast",
        });
      } else {
        setstartLoading(true);
        const formData = new FormData();
        formData.append("user_id", prop.guruData?.id);
        formData.append("fcm_token", prop.guruData?.fcm_token);
        formData.append("reviewer_id", getUserData?.id);
        formData.append("description", data.reviewDescription);
        formData.append("rating", starRating.toString());
        formData.append("complement", complementVal);
        let totalFilesToBeUploaded = captureImageData.length;
        for (let i = 0; i < totalFilesToBeUploaded; i++) {
          formData.append("images[]", captureImageData[i]);
        }

        axios({
          method: "POST",
          url: reviewUrl,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then(function (response) {
            prop.axiosDatta();
            prop.setreviewIsOpen(false);
            setstarRating(0);
            settextReviewVal("");
            reset();
            setstartLoading(false);
          })
          .catch(function (error) {
            setstartLoading(false);
            console.log(error?.response?.data);
          });
      }
    } else {
      prop.settoastMessage("Sorry, something went wrong!");
      prop.settoastOpen(true);
    }
  };

  return (
    <>
      {/* Loading Screen Component */}
      <LoadingStartCompo
        startLoading={startLoading}
        setstartLoading={setstartLoading}
      />

      <IonModal
        className="premium-modal review-modal Addreviewmodal"
        isOpen={prop.reviewIsOpen}
        onWillDismiss={handleModalOff}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <IonContent className="info" style={{ maxHeight: "100vh", overflow: "hidden" }}>
          <IonIcon
            className="close"
            icon={close}
            onClick={handleModalOff}
          ></IonIcon>

          <div className="info-profile">
            <IonIcon icon={information}></IonIcon> <h1> Profile Info</h1>
          </div>

          <div className="avtar-heading">
            <h2>Name</h2>
            <p>{prop.guruData !== null ? prop.guruData?.name : ""}</p>
          </div>

          <h5>Add Review & Rating</h5>
          <div className="review-rating">
            <form onSubmit={handleSubmit(submitBtn)}>
              <Rating
                {...register("starrating")}
                size={30}
                onClick={handleRating}
                initialValue={starRating}
                name="starrating"
              />

              <div className="reviews-comment">
                {/* <IonList> */}
                <IonRadioGroup
                  {...register("complement")}
                  name="complement"
                  onIonChange={handleComplement}
                  className="complement-radio"
                >
                  <div className="reviews-comment">
                    <ul className="left-side-review">
                      <li>
                        <IonRadio
                          value="1"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                          className="review-checkbox"
                        >
                          <div>
                            <img
                              src={imageIndexing.hand}
                              alt={imageIndexing.hand}
                            />
                            <IonLabel>Thank You</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="2"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.fire}
                              alt={imageIndexing.fire}
                            ></img>
                            <IonLabel>Hot Stuff</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="3"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.like}
                              alt={imageIndexing.like}
                            ></img>
                            <IonLabel>Like Your Profile</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="4"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.ink}
                              alt={imageIndexing.ink}
                            ></img>
                            <IonLabel>Good Writer</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="5"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.notebook}
                              alt={imageIndexing.notebook}
                            ></img>
                            <IonLabel>Write More</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="6"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.funny}
                              alt={imageIndexing.funny}
                            ></img>
                            <IonLabel>You Are Funny</IonLabel>
                          </div>
                        </IonRadio>
                      </li>
                      {/* </ul> */}

                      <li>
                        <IonRadio
                          value="7"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.smart}
                              alt={imageIndexing.smart}
                            ></img>
                            <IonLabel>You're Cool</IonLabel>
                          </div>
                        </IonRadio>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <IonRadio
                          value="8"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.heart}
                              alt={imageIndexing.heart}
                            ></img>
                            <IonLabel>Cute Pic</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="9"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.notice}
                              alt={imageIndexing.notice}
                            ></img>
                            <IonLabel>Great List</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="10"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.msgBox}
                              alt={imageIndexing.msgBox}
                            ></img>
                            <IonLabel>Just a Note</IonLabel>
                          </div>
                        </IonRadio>
                      </li>

                      <li>
                        <IonRadio
                          value="11"
                          aria-label="Custom checkbox that is checked"
                          labelPlacement="end"
                        >
                          <div>
                            <img
                              src={imageIndexing.likeSubmit}
                              alt={imageIndexing.likeSubmit}
                            ></img>
                            <IonLabel>Great Photo</IonLabel>
                          </div>
                        </IonRadio>
                      </li>
                    </ul>
                  </div>
                </IonRadioGroup>
                {/* </IonList> */}
              </div>

              <IonLabel>Type the review description</IonLabel>
              <IonTextarea
                {...register("reviewDescription")}
                aria-label="description"
                placeholder="Description"
                className="contact-message"
                name="reviewDescription"
                onIonChange={textReview}
              />

              {/* <input
                {...register("imageCapture")}
                type="file"
                onChange={handleImageCapture}
                accept="image/*"
                name="imageCapture[]"
                multiple
              /> */}

              <label htmlFor="file-upload23" className="custom-file-upload">
                {captureImageData.length !== 0
                  ? imageTextName
                  : "No choosen file"}
              </label>
              <input
                {...register("imageCapture")}
                id="file-upload23"
                type="file"
                onChange={handleImageCapture}
                accept="image/*"
                name="imageCapture[]"
                multiple
                hidden
              />

              <IonButton type="submit">submit</IonButton>
            </form>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
}

export default AddReviewCompo;
