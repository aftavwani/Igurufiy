import { IonLoading } from "@ionic/react";

const LoadingStartCompo: React.FC = (prop: any) => {
  return (
    <IonLoading
      isOpen={prop.startLoading}
      onDidDismiss={() => prop.setstartLoading(false)}
      message={"Loading..."}
    />
  );
};
export default LoadingStartCompo;
