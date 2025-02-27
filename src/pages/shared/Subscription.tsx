import React, { useEffect, useState } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonButton,
  IonContent,
  IonInput,
  IonLabel,
  IonPage,
  useIonViewWillLeave,
} from "@ionic/react";
import imageIndexing from "./../../assets/images/imageIndexing";
import ConnectionToast from "../../components/ConnectionToast";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import { Network } from "@capacitor/network";
import { useHistory } from "react-router-dom";

const Subscription: React.FC = () => {
  const signedUser = JSON.parse(sessionStorage.getItem("SignedUser"));
  const history = useHistory();
  // const Url = process.env.API_SOME_KEY + "process-payment/";
  const Url = process.env.API_SOME_KEY + "monthly-payment/";
  const [toastOpen, settoastOpen] = useState(false);
  const [checkNetwok, setcheckNetwok] = useState({});
  const [toastMessage, settoastMessage] = useState("No Internet Connection!");
  const [startLoading, setstartLoading] = useState(false);

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
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    } else {
      if (signedUser === null) {
        history.push("/register");
      }
    }
  }, []);

  useIonViewWillLeave(() => {
    sessionStorage.removeItem("SignedUser");
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const validateInputs = () => {
    const newErrors = {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    };

    // Card Number Validation
    if (!cardDetails.cardNumber) {
      newErrors.cardNumber = "Card number is required.";
    } else if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardDetails.cardNumber)) {
      newErrors.cardNumber =
        "Card number must be 16 digits in XXXX-XXXX-XXXX-XXXX format.";
    }

    // Expiry Date Validation
    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format.";
    }

    // CVV Validation
    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required.";
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => !error);
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === "cardNumber") {
      // Remove all non-numeric characters
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      // Add a hyphen after every 4 digits
      value = sanitizedValue.match(/.{1,4}/g)?.join("-") || sanitizedValue;
    }

    if (name === "expiryDate") {
      // Remove non-numeric characters
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      // Format as MM/YY
      if (sanitizedValue.length <= 2) {
        value = sanitizedValue;
      } else {
        value = sanitizedValue.slice(0, 2) + "/" + sanitizedValue.slice(2, 4);
      }
    }

    setCardDetails({
      ...cardDetails,
      [name]: value,
    });

    // Clear error for the field being updated
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return; // Stop submission if validation fails
    }

    setstartLoading(true);
    axios
      .post(Url, {
        cardNumber: cardDetails?.cardNumber.replace(/-/g, ""), // Send without hyphens
        expiryDate: cardDetails?.expiryDate,
        cvv: cardDetails?.cvv,
        user_id: "2917",
        // user_id: signedUser?.id,
      })
      .then(function (response) {
        setstartLoading(false);
        toast.success(response?.data?.message);
        console.log(response?.data?.data);

        // setCardDetails({
        //   cardNumber: "",
        //   expiryDate: "",
        //   cvv: "",
        // });
        // sessionStorage.setItem(
        //   "authorisePayment",
        //   JSON.stringify(response?.data?.data)
        // );

        history.push("/authorise");
      })
      .catch(function (error) {
        setstartLoading(false);
        // console.log(error?.response?.data?.subscription?.L_LONGMESSAGE0);
        // console.log(Array.isArray(error?.response?.data?.errors));
        // console.log(error?.response?.data?.errors);

        if (Array.isArray(error?.response?.data?.errors)) {
          if (error?.response?.data?.errors.length > 1) {
            error?.response?.data?.errors.map((data: any) => {
              toast.error(data);
            });
          } else {
            toast.error(error?.response?.data?.errors[0]);
          }
        } else {
          toast.error(error?.response?.data?.subscription?.L_LONGMESSAGE0);
        }
      });
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonPage>
        <IonContent fullscreen className="main payment-page">
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <div className="ion-text-center">
            <img src={imageIndexing.logo} alt={imageIndexing.logo} />
          </div>
          <div className="content content-sec payment-hding">
            <h2>Payment Details ($4.99) Monthly</h2>
            <div className="payment-method-form">
              <form onSubmit={handlePayment}>
                <div className="form-group">
                  <IonLabel color="light">Card Number</IonLabel>
                  <IonInput
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onIonInput={(e: any) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    maxlength={19} // Updated for hyphens
                    placeholder="1234-5678-9012-3456"
                    inputMode="numeric"
                    className="custom"
                    required
                  />
                  {errors.cardNumber && (
                    <p className="error">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="form-group">
                  <IonLabel color="light">Expiry Date</IonLabel>
                  <IonInput
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onIonInput={(e: any) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    inputMode="numeric"
                    placeholder="MM/YY"
                    className="custom"
                    maxlength={5}
                    required
                  />
                  {errors.expiryDate && (
                    <p className="error">{errors.expiryDate}</p>
                  )}
                </div>
                <div className="form-group">
                  <IonLabel color="light">CVV</IonLabel>
                  <IonInput
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onIonInput={(e: any) =>
                      handleInputChange("cvv", e.target.value)
                    }
                    maxlength={4}
                    inputMode="numeric"
                    placeholder="Enter CVV"
                    className="custom"
                    required
                  />
                  {errors.cvv && <p className="error">{errors.cvv}</p>}
                </div>

                <IonButton
                  type="submit"
                  expand="block"
                  className="button-inner"
                  style={{ marginTop: 50 }}
                >
                  Pay
                </IonButton>
              </form>
            </div>
          </div>

          <ConnectionToast
            toastOpen={toastOpen}
            settoastOpen={settoastOpen}
            checkNetwok={checkNetwok}
            setcheckNetwok={setcheckNetwok}
            toastMessage={toastMessage}
            settoastMessage={settoastMessage}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Subscription;
