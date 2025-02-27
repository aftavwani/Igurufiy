import React, { useState, useEffect, useContext } from "react";
import "./../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonButton,
  IonTextarea,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from "@ionic/react";
import { pencil, camera, trash } from "ionicons/icons";
import imageIndexing from "../assets/images/imageIndexing";
import UserMenu from "../components/menu/UserMenu";
import Navigate from "../components/navigation/Navigate";
import { add } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Header from "../components/navigation/Header";
import RefreshDataCompo from "../components/RefreshDataCompo";
import ConnectionToast from "../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../components/LoadingStartCompo";
import { NotifiContext } from "../context/NotifiContext";

const EditProfile: React.FC = () => {
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      country: "",
      city: "",
      biographicalInfo: "",
    },
  });
  /**
   *
   * @param data
   */

  const getUserData = JSON.parse(localStorage.getItem("userData"));
  const Url = process.env.API_SOME_KEY + "meta-data/" + getUserData?.id;
  const trashPic = process.env.API_SOME_KEY + "profile/deleteimage";
  const [profile_cover, setprofile_cover] = useState({ profile_cover: "" });
  const [profile_avatar, setprofile_avatar] = useState("");
  const [profileCoverData, setprofileCoverData] = useState("");
  const [profileavatarData, setprofileavatarData] = useState("");
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);
  const [formData, setformData] = useState({
    country: "",
    city: "",
    biographicalInfo: "",
  });
  const [profileCover, setprofileCover] = useState("");
  const [fabActivate, setfabActivate] = useState(false);
  const { setNotifiCount } = useContext(NotifiContext);

  // ____ For split Name to Fname or Lname Start ____ //
  let fname = getUserData?.name;
  let lname = "";

  if (getUserData?.name.indexOf(" ") > 0) {
    fname = getUserData?.name.split(" ")[0];
    lname = getUserData?.name.split(" ").slice(1).toString().replace(",", " ");
    // console.log(getUserData?.name.split(" ").slice(1).toString().replace(",", ' '))
  }
  // ____ For split Name to Fname or Lname End ____ //

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    setcheckNetwok(status?.connected);

    if (status.connected === false) {
      settoastOpen(true);
    } else {
      settoastOpen(false);
      settoastMessage("No Internet Connection!");
    }
  };

  useEffect(() => {
    logCurrentNetworkStatus();

    if (checkNetwok !== false) {
      axiosData();
    } else {
      settoastMessage("Sorry something went wrong!");
    }
  }, []);

  const axiosData = async () => {
    setstartLoading(true); // Start loading

    try {
      const response = await axios.get(Url);
      const userData = response?.data[0];

      setprofileCover(userData?.usermeta);
      setprofileavatarData(userData?.avatar);

      setformData({
        country: userData?.usermeta?.country,
        city: userData?.usermeta?.city,
        biographicalInfo: userData?.usermeta?.biographical_info,
      });

      const profileCover = userData?.usermeta?.profile_cover;
      setprofileCoverData(
        profileCover
          ? `https://igurufy.com/storage/app/public/${profileCover}`
          : imageIndexing.defaultBanner
      );
    } catch (error) {
      console.error("Error fetching user data:", error?.response);
      // Handle the error appropriately, e.g., set an error message
    } finally {
      setstartLoading(false); // Reset loading state
    }

    try {
      const profileResponse = await axios.get(
        `${process.env.API_SOME_KEY}profile/${getUserData?.id}`
      );
      setNotifiCount(profileResponse?.data?.data?.userData);
    } catch (error) {
      console.error("Error fetching profile data:", error?.response);
      // Handle the error appropriately, e.g., set an error message
    }
  };

  const handleProfileCover = (e: any) => {
    setprofileCover(e.target.files[0]);
  };

  const handleProfileAvatar = (e: any) => {
    setprofile_avatar(e.target.files[0]);
    setfabActivate(false);
  };

  const handleFname = (e: any) => {
    fname = e.target.value;
  };

  const handleLname = (e: any) => {
    lname = e.target.value;
  };

  const submitBtn = async () => {
    if (checkNetwok !== false) {
      setstartLoading(true);
      const getformData = new FormData();
      getformData.append("id", getUserData?.id);
      getformData.append("country", formData?.country);
      getformData.append("city", formData?.city);
      getformData.append("biographical_info", formData?.biographicalInfo);
      getformData.append("profile_cover", profileCover);
      getformData.append("avatar", profile_avatar);
      getformData.append("fname", fname);
      getformData.append("lname", lname);
      getformData.append("type", "0");

      const Url = process.env.API_SOME_KEY + "meta-data/";
      await axios({
        method: "post",
        url: Url,
        data: getformData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          setfabActivate(false);
          toast.success(response?.data?.message);
          localStorage.setItem(
            "userData",
            JSON.stringify(response?.data?.data)
          );
          axiosData();
          setstartLoading(false);
        })
        .catch(function (error) {
          setstartLoading(false);
          toast.error(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  const onFormChange = (e: any) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTrash = async (pram: any) => {
    if (checkNetwok !== false) {
      setfabActivate(false);
      setstartLoading(true);
      await axios
        .post(trashPic, {
          user_id: getUserData?.id,
          type: pram,
        })
        .then(function (response) {
          toast.success(response?.data?.message);
          localStorage.setItem(
            "userData",
            JSON.stringify(response?.data?.data?.user)
          );
          axiosData();
          setstartLoading(false);
        })
        .catch(function (error) {
          console.log(error?.response);
          setstartLoading(false);
          toast.success(error?.response?.data?.message);
        });
    } else {
      settoastMessage("Sorry, something went wrong!");
      settoastOpen(true);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <UserMenu />
      <IonPage id="main-content" className="bg-color">
        {/* Header Component */}
        <Header />

        <IonContent fullscreen className="top-section">
          {/* Refresh Data Component */}
          <RefreshDataCompo
            axiosData={axiosData}
            toastOpen={toastOpen}
            settoastOpen={settoastOpen}
            checkNetwok={checkNetwok}
            setcheckNetwok={setcheckNetwok}
            toastMessage={toastMessage}
            settoastMessage={settoastMessage}
          />

          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="banner-img">
            <h1>Edit Profile</h1>
          </div>

          <div className="inner-content gurus-profile-form profile-updated registration">
            <div
              className="profile-banner"
              style={{
                background: `url(${profileCoverData}) no-repeat center/cover`,
              }}
            >
              {profile_cover !== null &&
              profile_cover?.profile_cover !== null &&
              profile_cover?.profile_cover !== "" ? (
                <label style={{ right: "341px" }} className="profile-trash">
                  <IonIcon
                    icon={trash}
                    onClick={() => handleTrash("coverpic")}
                  ></IonIcon>
                </label>
              ) : (
                ""
              )}

              <label htmlFor="chart" className="edit">
                <IonIcon icon={pencil}></IonIcon>
              </label>
              <input
                id="chart"
                type="file"
                accept="image/*"
                onChange={handleProfileCover}
              />
            </div>

            <div className="profile-images edit-profile-img">
              <img
                className="profile-avtar"
                src={
                  "https://igurufy.com/storage/app/public/" + profileavatarData
                }
                alt={
                  "https://igurufy.com/storage/app/public/" + profileavatarData
                }
              />

              <IonFab
                slot="fixed"
                vertical="top"
                horizontal="end"
                edge={true}
                activated={fabActivate}
              >
                <IonFabButton color="favorite">
                  <IonIcon className="edit-avatar" icon={pencil}></IonIcon>
                </IonFabButton>
                <IonFabList className="edit-toggle-open" side="bottom">
                  <IonFabButton color="favorite">
                    <label htmlFor="prifileAvatar">
                      <IonIcon icon={camera}></IonIcon>
                    </label>
                    <input
                      id="prifileAvatar"
                      type="file"
                      onChange={handleProfileAvatar}
                      accept="image/*"
                    />
                  </IonFabButton>
                  {getUserData?.avatar !== "users/default.png" ? (
                    <IonFabButton color="favorite">
                      <IonIcon
                        onClick={() => handleTrash("profilepic")}
                        icon={trash}
                      ></IonIcon>
                    </IonFabButton>
                  ) : (
                    ""
                  )}
                </IonFabList>
              </IonFab>
            </div>

            <form onSubmit={handleSubmit(submitBtn)}>
              <IonLabel color="dark">
                {getUserData?.ig_username != null
                  ? "Instagram Username"
                  : getUserData?.username != null
                  ? "Username"
                  : "TikTok Username"}
              </IonLabel>
              <IonInput
                placeholder="User Name"
                className="custom"
                name="ig_username"
                value={
                  getUserData?.ig_username != null
                    ? getUserData?.ig_username
                    : getUserData?.username != null
                    ? getUserData?.username
                    : getUserData?.tiktok_username
                }
                disabled
              />

              <IonLabel color="dark">First Name</IonLabel>
              <IonInput
                placeholder="First Name"
                className="custom"
                name="firstName"
                onIonInput={handleFname}
                value={fname}
                disabled={getUserData?.role_id === 4 ? false : true}
              />

              <IonLabel color="dark">Last Name</IonLabel>
              <IonInput
                placeholder="Last Name"
                className="custom"
                name="lastName"
                onIonInput={handleLname}
                value={lname}
                disabled={getUserData?.role_id === 4 ? false : true}
              />

              <IonLabel color="dark">Country</IonLabel>
              <IonInput
                {...register("country")}
                placeholder="Country"
                className="custom"
                name="country"
                onIonInput={onFormChange}
                value={formData?.country}
              />

              <IonLabel color="dark">City</IonLabel>
              <IonInput
                {...register("city")}
                placeholder="City"
                className="custom"
                name="city"
                onIonInput={onFormChange}
                value={formData?.city}
              />

              <IonLabel color="dark">Biographical Info</IonLabel>
              <IonTextarea
                {...register("biographicalInfo")}
                placeholder="Title"
                className="contact-message"
                name="biographicalInfo"
                onIonInput={onFormChange}
                value={formData?.biographicalInfo}
              ></IonTextarea>

              <IonButton expand="block" className="submit" type="submit">
                Save
              </IonButton>
            </form>

            <div className="form">
              <IonLabel color="dark">Additional Info</IonLabel>
              <NavLink to="/additional-info" className="link">
                <IonButton color="light" expand="block">
                  Add Info
                  <IonIcon slot="end" icon={add}></IonIcon>
                </IonButton>
              </NavLink>
            </div>
          </div>

          {/* Connection Toast Components */}
          <ConnectionToast
            toastOpen={toastOpen}
            settoastOpen={settoastOpen}
            checkNetwok={checkNetwok}
            setcheckNetwok={setcheckNetwok}
            toastMessage={toastMessage}
            settoastMessage={settoastMessage}
          />
        </IonContent>

        {/* Footer Navigate bars components */}
        <Navigate />
      </IonPage>
    </>
  );
};
export default EditProfile;
