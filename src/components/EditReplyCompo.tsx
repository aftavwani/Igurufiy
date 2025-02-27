import React, { useState } from "react";
import { IonModal, IonTextarea, IonButton, IonLabel } from "@ionic/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";

function EditReplyCompo(prop: any) {
  const ReplyData = prop.editReplyData;
  const Url = process.env.API_SOME_KEY + "explore-gurus/add-reply/add";

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reply: ReplyData?.review_replies?.description,
    },
  });
  /**
   *
   * @param data
   */

  const submitBtn = async (data: any) => {
    await axios
      .post(Url, {
        reply_id: ReplyData?.id,
        description: data?.reply,
        reviewer_id: ReplyData?.reviewer_id,
        user_id: ReplyData?.user_id,
        status: ReplyData?.review_replies === null ? 0 : 1,
      })
      .then(function (response) {
        prop.seteditReplyIsOpen(false);
        prop.axiosData();
        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        console.log(error?.response?.data);
      });
  };

  const handleModalOff = () => {
    prop.seteditReplyIsOpen(false);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonModal
        className="edit-profile-modal"
        isOpen={prop.editReplyIsOpen}
        onWillDismiss={handleModalOff}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <div className="ion-margin-top report-click repost-popup edit-profile edit-reply">
          <form onSubmit={handleSubmit(submitBtn)}>
            <IonLabel color="dark">Reply</IonLabel>
            <IonTextarea
              {...register("reply", {
                required: "Reply field is a required",
              })}
              className="custom cstm-msg-area edit-reply-textarea"
              name="reply"
              placeholder="Write Something..."
            ></IonTextarea>
            <ErrorMessage
              errors={errors}
              name="reply"
              as={<div className="error" />}
            />

            <div className="">
              <IonButton className="accept-btn" type="submit">
                Accept
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
}

export default EditReplyCompo;
