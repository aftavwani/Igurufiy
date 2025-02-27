import React from "react";
import "./../assets/css/StyleSheet.css";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import imageIndexing from "./../assets/images/imageIndexing";
import { Tooltip } from "react-tooltip";

const Complement: React.FC = (props: any) => {
  const allComplement = [
    {
      text: "Thank You",
      id: 1,
      image: imageIndexing.hand,
    },
    {
      text: "Hot Stuff",
      id: 2,
      image: imageIndexing.fire,
    },
    {
      text: "Like Your Profile",
      id: 3,
      image: imageIndexing.like,
    },
    {
      text: "Good Writer",
      id: 4,
      image: imageIndexing.ink,
    },
    {
      text: "Write More",
      id: 5,
      image: imageIndexing.notebook,
    },
    {
      text: "You Are Funny",
      id: 6,
      image: imageIndexing.funny,
    },
    {
      text: "You're Cool",
      id: 7,
      image: imageIndexing.smart,
    },
    {
      text: "Cute Pic",
      id: 8,
      image: imageIndexing.heart,
    },
    {
      text: "Great List",
      id: 9,
      image: imageIndexing.notice,
    },
    {
      text: "Just a Note",
      id: 10,
      image: imageIndexing.msgBox,
    },
    {
      text: "Great Photo",
      id: 11,
      image: imageIndexing.likeSubmit,
    },
  ];

  const getCount = (id: any) => {
    if (props.division !== "") {
      const filteredData = props.division.filter((item: any) => {
        return item.complement === id;
      });
      return filteredData.length;
    } else {
      return 0;
    }
  };
  return (
    <>
      <IonGrid className="public-icon">
        <IonRow>
          {allComplement.map((singleData: any, index: any) => (
            <IonCol
              key={index}
              data-tooltip-id={"tooltip-" + singleData?.id}
              data-tooltip-content={singleData?.text}
            >
              <img src={singleData?.image} alt={singleData?.image} />
              <p>{getCount(singleData?.id)}</p>
              <Tooltip id={"tooltip-" + singleData?.id} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </>
  );
};
export default Complement;
