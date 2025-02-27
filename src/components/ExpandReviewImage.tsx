import {
  IonModal,
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";

function ExpandReviewImage(prop: any) {
  const handleModalOff = () => {
    prop.setreviewImgOpen(false);
  };
  return (
    <IonModal
      className="expand-review-modal expand-modal"
      isOpen={prop.reviewImgOpen}
      onWillDismiss={handleModalOff}
    >
      <IonContent className="ion-padding expand-review-img expand-img">
        <IonIcon icon={close} className="close-btn" onClick={handleModalOff}></IonIcon>
        <Swiper modules={[Navigation, Pagination, EffectCards]} navigation>
          {prop.reviewImgData.split("|").map((data: any, index: any) => (
            <SwiperSlide key={index}>
              <img
                src={"https://igurufy.com/public/reviews/" + data}
                alt={"https://igurufy.com/public/reviews/" + data}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </IonContent>
    </IonModal>
  );
}

export default ExpandReviewImage;
