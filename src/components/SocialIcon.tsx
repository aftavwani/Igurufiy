import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoTiktok,
  logoInstagram,
  logoTwitter,
} from "ionicons/icons";
import { Link } from "react-router-dom";

const SocialIcon: React.FC = (prop: any) => {
  const urlData = prop.metaUserData;
  return (
    <div className="social-media">
      {urlData != null && urlData.facebook_url != null ? (
        <a href={urlData?.facebook_url}>
          <IonIcon icon={logoFacebook}></IonIcon>
        </a>
      ) : (
        <Link to={"/guru-detail/" + prop.guruData?.slug}>
          <IonIcon icon={logoFacebook}></IonIcon>
        </Link>
      )}

      {urlData != null && urlData.tiktok_url != null ? (
        <a href={urlData?.tiktok_url}>
          <IonIcon icon={logoTiktok}></IonIcon>
        </a>
      ) : (
        <Link to={"/guru-detail/" + prop.guruData?.slug}>
          <IonIcon icon={logoTiktok}></IonIcon>
        </Link>
      )}

      {urlData != null && urlData.instagram_url != null ? (
        <a href={urlData?.instagram_url}>
          <IonIcon icon={logoInstagram}></IonIcon>
        </a>
      ) : (
        <Link to={"/guru-detail/" + prop.guruData?.slug}>
          <IonIcon icon={logoInstagram}></IonIcon>
        </Link>
      )}

      {urlData != null && urlData.twitter_url != null ? (
        <a href={urlData?.twitter_url}>
          <IonIcon icon={logoTwitter}></IonIcon>
        </a>
      ) : (
        <Link to={"/guru-detail/" + prop.guruData?.slug}>
          <IonIcon icon={logoTwitter}></IonIcon>
        </Link>
      )}
    </div>
  );
};

export default SocialIcon;
