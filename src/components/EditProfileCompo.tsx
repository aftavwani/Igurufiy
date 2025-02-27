import React, { useState } from "react";
import { IonModal, IonTextarea, IonButton, IonLabel } from "@ionic/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

function EditProfileCompo(prop: any) {
  const reviewData = prop.EditProfileData;
  const Url = process.env.API_SOME_KEY + "explore-gurus/edit-review/edit";

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      describe: reviewData?.description,
    },
  });
  /**
   *
   * @param data
   */

  const submitBtn = async (data: any) => {
    await axios
      .post(Url, {
        id: reviewData?.id,
        description: data.describe,
        user_id: reviewData?.user_id
      })
      .then(function (response) {
        prop.setEditIsOpen(false);
        prop.setreviewerData(response?.data?.data)
        toast.success(response?.data?.message);
      })
      .catch(function (error) {
        console.log(error?.response?.data);
      });
  };

  const handleModalOff = () => {
    prop.setEditIsOpen(false);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonModal
        className="edit-profile-modal"
        isOpen={prop.EditIsOpen}
        onWillDismiss={handleModalOff}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <div className="ion-margin-top report-click repost-popup edit-profile">
          <form onSubmit={handleSubmit(submitBtn)}>
            <IonLabel color="dark">Describe</IonLabel>
            <IonTextarea
              {...register("describe")}
              className="custom cstm-msg-area"
              name="describe"
              placeholder="Write Something..."
              rows={12}
              cols={100}
            ></IonTextarea>

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

export default EditProfileCompo;
