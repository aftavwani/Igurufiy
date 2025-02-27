import {
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";

const RefreshDataCompo: React.FC = (prop: any) => {
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      if (prop.checkNetwok !== false) {
        prop.axiosData();
      } else {
        prop.settoastMessage("Sorry, something went wrong!");
        prop.settoastOpen(true);
      }
      event.detail.complete();
    }, 2000);
  }
  return (
    <>
      <IonRefresher
        slot="fixed"
        pullFactor={0.5}
        pullMin={100}
        pullMax={200}
        onIonRefresh={handleRefresh}
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
    </>
  );
};
export default RefreshDataCompo;
