import React, { useState, useEffect, useRef } from "react";
import "./../assets/css/StyleSheet.css";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";

const Rating: React.FC = (props: any) => {
  let totalRating = 0;
  let ratingLength = props.rating;
  if (props.rating.length > 0) {
    const sumRating = props.rating.reduce((accumulator: any, object: any) => {
      return accumulator + object.rating;
    }, 0);
    totalRating = Math.round(sumRating) / props.rating.length;
  } else {
    totalRating = 0;
  }

  return (
    <>
      <div>
        <IonIcon
          color={Math.round(totalRating) < 1 ? "medium" : "warning"}
          style={{ fontSize: "25px" }}
          icon={star}
        ></IonIcon>
        <IonIcon
          color={Math.round(totalRating) < 2 ? "medium" : "warning"}
          style={{ fontSize: "25px" }}
          icon={star}
        ></IonIcon>
        <IonIcon
          color={Math.round(totalRating) < 3 ? "medium" : "warning"}
          style={{ fontSize: "25px" }}
          icon={star}
        ></IonIcon>
        <IonIcon
          color={Math.round(totalRating) < 4 ? "medium" : "warning"}
          style={{ fontSize: "25px" }}
          icon={star}
        ></IonIcon>
        <IonIcon
          color={Math.round(totalRating) < 5 ? "medium" : "warning"}
          style={{ fontSize: "25px" }}
          icon={star}
        ></IonIcon>
      </div>
      <p>
        <span className="dot"> . </span> {Math.round(totalRating)} out of 5{" "}
        <span className="dot"> . </span>{" "}
        {props.ratingText === true
          ? (ratingLength !== null ? ratingLength.length : 0) + " Reviews"
          : ""}
      </p>
    </>
  );
};
export default Rating;
