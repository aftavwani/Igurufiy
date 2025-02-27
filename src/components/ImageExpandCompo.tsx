import { IonModal, IonContent, IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

function ImageExpandCompo(prop: any) {
  const handleModalOff = () => {
    prop.setimageIsOpen(false);
  };
  return (
    <IonModal
      className="expand-modal"
      isOpen={prop.imageIsOpen}
      onWillDismiss={handleModalOff}
    >
      <IonContent className="ion-padding expand-img">
          <IonIcon icon={close} onClick={handleModalOff} className="close-btn"></IonIcon>
        <img
          src={"https://igurufy.com/storage/app/public/" + prop.guruDataAvatar}
          alt={"https://igurufy.com/storage/app/public/" + prop.guruDataAvatar}
        />
      </IonContent>
    </IonModal>
  );
}

export default ImageExpandCompo;
