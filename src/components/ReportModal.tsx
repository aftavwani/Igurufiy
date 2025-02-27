import React, { useRef } from "react";
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
  createAnimation,
} from "@ionic/react";
import axios from "axios";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { close } from "ionicons/icons";

function ReportModal(prop: any) {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const reviewData = prop.repostData;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      describe: "",
    },
  });
  /**
   *
   * @param data
   */

  const Url = process.env.API_SOME_KEY + "explore-gurus/post/add-review-report";
  const handleSub = async (data: any) => {
    await axios
      .post(Url, {
        report_content: data?.describe,
        review_id: reviewData?.id,
        user_id: getUserData?.id,
        profile_id: prop.profileUserId,
      })
      .then(function (response) {
        toast.success(response?.data?.message);
        reset();
        prop.setreportIsOpen(false);
      })
      .catch(function (error) {
        console.log(error?.response);
        toast.error(error?.response?.data?.message);
      });
  };

  const handleModalOff = () => {
    reset();
    prop.setreportIsOpen(false);
  };

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

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonModal
        id="example-modal"
        isOpen={prop.reportIsOpen}
        className="premium-modal report-modal"
        onWillDismiss={handleModalOff}
        enterAnimation={enterAnimation}
        leaveAnimation={leaveAnimation}
      >
        <IonContent>
          <IonToolbar className="modal-tittle-content">
            <h5>Report</h5>
            <IonButtons slot="end">
              <IonIcon
                icon={close}
                size="large"
                onClick={handleModalOff}
              ></IonIcon>
            </IonButtons>
          </IonToolbar>
          <div className="ion-margin-top report-click repost-popup">
            <form onSubmit={handleSubmit(handleSub)}>
              <IonLabel color="dark">Describe</IonLabel>
              <IonTextarea
                {...register("describe", {
                  required: "Report field is a required",
                })}
                className="custom"
                name="describe"
                placeholder="Write Something..."
                // maxlength={20}
                rows={12}
                cols={100}
              ></IonTextarea>
              <ErrorMessage
                errors={errors}
                name="describe"
                as={<div className="error" />}
              />

              <div className="">
                <IonButton className="accept-btn" type="submit">
                  Accept
                </IonButton>
              </div>
            </form>
          </div>
        </IonContent>
      </IonModal>

      {/* <IonModal
        isOpen={prop.reportIsOpen}
        onWillDismiss={handleModalOff}
        initialBreakpoint={0.25}
        breakpoints={[0, 0.25, 0.5, 0.75]}
        handleBehavior="cycle"
      >
        <IonContent className="ion-padding">
          <div className="ion-margin-top repost-popup">
            <form onSubmit={handleSubmit(handleSub)}>
              <IonLabel color="dark">Describe</IonLabel>
              <IonTextarea
                {...register("describe", {
                  required: "Report field is a required",
                })}
                className="custom"
                name="describe"
                placeholder="Write Something..."
              ></IonTextarea>
              <ErrorMessage
                errors={errors}
                name="describe"
                as={<div className="error" />}
              />

              <IonButton type="submit">Add</IonButton>
            </form>
          </div>
        </IonContent>
      </IonModal> */}
    </>
  );
}

export default ReportModal;
