import React, { useState, useRef, useEffect } from "react";
import "./../../assets/css/StyleSheet.css";
import {
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonText,
  IonIcon,
  IonModal,
  IonToolbar,
  IonButtons,
  useIonViewWillLeave,
  IonHeader,
} from "@ionic/react";
import {
  eyeOutline,
  eyeOffOutline,
  arrowBackCircle,
  close,
} from "ionicons/icons";
import { Link, NavLink } from "react-router-dom";
import imageIndexing from "./../../assets/images/imageIndexing";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ConnectionToast from "../../components/ConnectionToast";
import { Network } from "@capacitor/network";
import LoadingStartCompo from "../../components/LoadingStartCompo";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";

const RegisterAsReviewer: React.FC = () => {
  const nullEntry: any[] = [];
  const [notifications, setnotifications] = useState(nullEntry);

  const modalTerms = useRef<HTMLIonModalElement>(null);
  function dismissTerms() {
    modalTerms.current?.dismiss();
  }

  const TermsAcceptBtn = () => {
    setcheckedData(true);
    setcheckboxData(true);
    modalTerms.current?.dismiss();
  };

  const history = useHistory();

  //_____  SHOW AND HIDE PASSSWORD START  _____//
  const [passwordEye, setpasswordEye] = useState(eyeOutline);
  const [passwordType, setpasswordType] = useState("password");

  const eyeToggle = () => {
    if (passwordEye == eyeOutline && passwordType == "password") {
      setpasswordEye(eyeOffOutline);
      setpasswordType("text");
    }

    if (passwordEye == eyeOffOutline && passwordType == "text") {
      setpasswordEye(eyeOutline);
      setpasswordType("password");
    }
  };
  //_____  SHOW AND HIDE PASSSWORD END  _____//

  //_____  SHOW AND HIDE CONFIRM PASSSWORD START  _____//
  const [cPasswordEye, setcPasswordEye] = useState(eyeOutline);
  const [cPasswordType, setcPasswordType] = useState("password");

  const cEyeToggle = () => {
    if (cPasswordEye == eyeOutline && cPasswordType == "password") {
      setcPasswordEye(eyeOffOutline);
      setcPasswordType("text");
    }

    if (cPasswordEye == eyeOffOutline && cPasswordType == "text") {
      setcPasswordEye(eyeOutline);
      setcPasswordType("password");
    }
  };
  //_____  SHOW AND HIDE CONFIRM PASSSWORD END  _____//

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
    },
  });
  /**
   *
   * @param data
   */
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
    // PushNotifications.checkPermissions().then((res: any) => {
    //   if (res.receive !== "granted") {
    //     PushNotifications.requestPermissions().then((res: any) => {
    //       //do something
    //     });
    //   } else {
    //     //return false
    //   }
    // });
    logCurrentNetworkStatus();
    if (checkNetwok === false) {
      settoastMessage("Sorry something went wrong!");
    }
  }, []);

  const [checkboxData, setcheckboxData] = useState(false);
  const onChechbox = (e: any) => {
    if (e.target.checked === true) {
      setcheckedData(true);
    } else {
      setcheckedData(false);
    }
    setcheckboxData(e.target.checked);
  };

  const [agreeCheckbox, setagreeCheckbox] = useState("");
  const [checkedData, setcheckedData] = useState(false);

  const loginSub = (data: any) => {
    PushNotifications.checkPermissions().then((res: any) => {
      if (res.receive !== "granted") {
        PushNotifications.requestPermissions().then((res: any) => {
          //do something
        });
      }
    });
    if (checkNetwok === true) {
      if (checkboxData == false) {
        setagreeCheckbox("Condition and terms will be required");
      } else {
        if (checkboxData == true) {
          setstartLoading(true);
          PushNotifications.register();

          // On success, we should be able to receive notifications
          PushNotifications.addListener("registration", (token: Token) => {
            const Url = process.env.API_SOME_KEY + "register-reviewer";

            axios
              .post(Url, {
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                check: "Agree",
                 fcm_token: token?.value,
              })
              .then(function (response) {                
                setagreeCheckbox("");
                setcheckedData(false);
                toast.success(response.data.msg, {
                  duration: 3000,
                });
                reset();
                setstartLoading(false);
                sessionStorage.setItem("cData", "data");
                history.push("/login");

                useIonViewWillLeave(() => {
                  setTimeout(() => {
                    sessionStorage.removeItem("cData");
                  }, 3000);
                });
              })
              .catch(function (error) {
                console.log(error);
                const cData = JSON.parse(sessionStorage.getItem("cData"));

                if (cData === null) {
                  Object.keys(error.response.data.errors).map((key) => {
                    toast.error(error.response.data.errors[key][0]);
                  });
                }
                setstartLoading(false);
              });
          });
        }
      }
    } else {
      settoastOpen(true);
      settoastMessage("No Internet Connection!");
    }
  };

  const goBack = () => {
    reset();
    if (agreeCheckbox.length != 0) {
      setagreeCheckbox("");
    }
    setcheckedData(false);
  };

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <IonPage>
        <IonContent fullscreen className="main">
          {/* Loading Screen Component */}
          <LoadingStartCompo
            startLoading={startLoading}
            setstartLoading={setstartLoading}
          />

          <IonHeader className="ion-text-center login-main-header">
            <NavLink to="/register">
              <IonIcon
                className="back-icon"
                icon={arrowBackCircle}
                size="large"
                onClick={goBack}
              ></IonIcon>
            </NavLink>

            <Link to="/index">
              <img src={imageIndexing.logo} alt={imageIndexing.logo} />
            </Link>
          </IonHeader>
          <div className="content">
            <IonText className="ion-text-center">
              <h4 className="adasdsf">Reviewer Registration</h4>
            </IonText>
            <form onSubmit={handleSubmit(loginSub)} id="create-course-form">
              <IonLabel color="light">Username</IonLabel>
              <IonInput
                {...register("username", {
                  required: "User Name is a required field",
                })}
                placeholder="Username"
                className="custom"
                name="username"
              />
              <ErrorMessage
                errors={errors}
                name="username"
                as={<div className="error" />}
              />

              <IonLabel color="light">Email</IonLabel>
              <IonInput
                {...register("email", {
                  required: "Email is a required field",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "invalid email address",
                  },
                })}
                placeholder="Email"
                className="custom"
                name="email"
              />
              <ErrorMessage
                errors={errors}
                name="email"
                as={<div className="error" />}
              />

              <div className="password">
                <IonLabel color="light">Password</IonLabel>
                <IonInput
                  {...register("password", {
                    required: "Password is a required field",
                  })}
                  placeholder="password"
                  className="custom"
                  name="password"
                  type={passwordType}
                />
                <IonIcon
                  onClick={eyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={passwordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="password"
                as={<div className="error" />}
              />

              <div className="password">
                <IonLabel color="light">Confirm Password</IonLabel>
                <IonInput
                  {...register("password_confirmation", {
                    required: "Confirm Password is a required field",
                  })}
                  placeholder="Confirm password"
                  className="custom"
                  name="password_confirmation"
                  type={cPasswordType}
                />
                <IonIcon
                  onClick={cEyeToggle}
                  style={{ marginLeft: "50%", fontSize: "50px", color: "#000" }}
                  icon={cPasswordEye}
                ></IonIcon>
              </div>
              <ErrorMessage
                errors={errors}
                name="password_confirmation"
                as={<div className="error" />}
              />

              <div className="ion-color-light">
                <IonCheckbox
                  className="remember-checkbox remember terms"
                  labelPlacement="end"
                  name="consent"
                  onIonChange={onChechbox}
                  checked={checkedData}
                  value="Agree"
                  id="open-reviewer-terms"
                >
                  <IonText color="light">
                    Check box if you agree to our terms & conditions*
                  </IonText>
                </IonCheckbox>
                <div className="check-error">{agreeCheckbox}</div>
              </div>
              <IonButton
                expand="block"
                className="button-inner"
                type="submit"
                style={{ marginTop: "30px" }}
              >
                Sign Up
              </IonButton>
            </form>
            <IonText className="ion-text-center">
              Have an Account?{" "}
              <NavLink className="login-link" to="/login">
                Log In
              </NavLink>
            </IonText>
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
      </IonPage>

      {/* //____  TERMS CONDITIONS CHECKBOX MODAL START ____// */}
      <IonModal
        id="example-modal"
        backdrop-dismiss={false}
        className="premium-modal terms-popup"
        ref={modalTerms}
        trigger={checkboxData === false ? "open-reviewer-terms" : ""}
      >
        <IonContent className="term-content">
          <IonToolbar className="modal-tittle-content">
            {/* <IonTitle> */}
            <h5>TERMS AND CONDITIONS</h5>
            {/* </IonTitle> */}
            <IonButtons slot="end">
              <IonIcon
                icon={close}
                size="large"
                onClick={() => dismissTerms()}
              ></IonIcon>
            </IonButtons>
          </IonToolbar>
          <div className="popup-data">
            <h2>TERMS AND CONDITIONS</h2>
            <p className="popup-txt">
              This Agreement was last revised on August 10 2023.
            </p>

            <IonText>
              <h3>Introduction</h3>
            </IonText>
            <IonText>
              <p>www.igurufy.com (“we,” “us,” or “our”) welcomes you.</p>
            </IonText>

            <IonText>
              <p>
                {" "}
                We provide you with access to our services through our “Website”
                (defined below) subject to the following Terms of Service, which
                may be updated by us from time to time without notice to you.
              </p>
            </IonText>

            <IonText>
              <p>
                By accessing and using this website, you accept that you have
                read, understood, and agree to be lawfully bound by these terms
                and conditions and our Privacy Policy, which are hereby
                incorporated by reference (collectively, this “Agreement”).
              </p>
            </IonText>

            <IonText>
              <p>
                In case you do not agree with any of these terms, then kindly do
                use the Website.
              </p>
            </IonText>

            <IonText>
              <h3>DEFINITIONS</h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Agreement” is a refers to these Terms and Conditions, the
                Privacy Policy, Cookies Policy and other documents of the
                website provided to you;
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Privacy Policy” means “https://igurufy.com/privacy is shown on
                our website;
              </p>
            </IonText>

            <IonText>
              <p>
                “Service” or “Services” is a reference to any service defined
                below, which we may supply and which you may request via our
                Website;
              </p>
            </IonText>
            <IonText>
              <p>
                “User”, “You” “Reviewer” and “your” are refers to the person who
                is accessing for taking any service from us. User shall include
                their @instagram username and email.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Customer” are refers to the user who take the subscription of
                Membership plan available on the Website;
              </p>
            </IonText>

            <IonText>
              <p>
                “Guru” or “Seller” refers to the user who are accessing as
                seller website for offering any service through the Website or
                responding back to “reviewers” regarding their feedback/ratings.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                “We”, “us”, “our” and “Company” are references to IGURUFY office
                at Los Angeles, California United States;
              </p>
            </IonText>

            <IonText>
              <p>
                ”Website” shall mean and include “https://igurufy.com, mobile
                application and any successor website or mobile application of
                the Company or any of its affiliates;
              </p>
            </IonText>

            <IonText>
              <p>
                “Applicable Law” means in respect of a person, any statute, law,
                regulation, ordinance, rule, judgment, decree, by-law, approval
                from the concerned authority, government resolution, order,
                directive, guideline, policy, requirement, or other governmental
                restriction or any similar form of decision, or determination,
                or any interpretation or adjudication having the force of law of
                any of the foregoing, by any concerned authority or other
                requirements of any governmental or regulatory authority, to
                which such person is subject;
              </p>
            </IonText>

            <IonText>
              <p>
                “Guru “or “Seller” Account shall mean an electronic account
                opened by the Seller or Guru with the Platform to offer Services
                through the Website.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Customer Account” shall mean an electronic account opened by
                the User with the Website to take the subscription of any
                service from the website.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Membership Fee” means the membership fee paid by Guru for
                participation in the Membership Plan, paid directly by customers
                to the Website.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                “Membership Plan” shall means the plan available on the Website
                through which members can avail various services available on
                the Website.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Gurus/Influencers: Registered individuals who maintain a profile
                on IGurufy.com and are subjected to reviews.
              </p>
            </IonText>

            <IonText>
              <p>
                Reviewers: Users who post feedback and opinions about
                Gurus/Influencers.
              </p>
            </IonText>
            <IonText>
              <p>2. Subscription and Billing</p>
            </IonText>

            <IonText>
              <p>
                2.1. Subscription for Gurus/Influencers: A monthly subscription
                fee of $4.99.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                2.2. Non-refundable Fee: Subscription charges, once billed, are
                final and non-refundable.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                2.3. Automatic Renewal: Subscriptions are renewed and billed on
                a monthly cycle.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                2.4. Cancellation Protocol: Must be communicated 30 days prior
                via the designated channels.
              </p>
            </IonText>

            <IonText>
              {" "}
              <p>3. Content Responsibility</p>
            </IonText>

            <IonText>
              <p>
                {" "}
                3.1. User Accountability: All users, both Gurus/Influencers and
                Reviewers, bear sole responsibility for their content.{" "}
              </p>
            </IonText>

            <IonText>
              <p>
                3.2. No Endorsement: IGURUFY neither verifies nor endorses any
                user-submitted content.{" "}
              </p>
            </IonText>

            <IonText>
              {" "}
              <p>4. Liability Limitation </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                4.1. Neutral Platform: IGURUFY offers a platform for opinions;
                it doesn't reflect the company's views.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                4.2. User Indemnification: Users will defend and indemnify
                IGURUFY against claims linked to their content.{" "}
              </p>
            </IonText>

            <IonText>
              {" "}
              <p>5. Reviews and Content Policy</p>
            </IonText>
            <IonText>
              <p>
                {" "}
                5.1. Authenticity: Reviews should stem from actual experiences.{" "}
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                5.2. Content Standards: Malicious, defamatory, or false content
                is strictly prohibited.{" "}
              </p>
            </IonText>

            <IonText>
              <p>
                5.3. Moderation Rights: IGURUFY can edit, move, or remove
                content as deemed necessary.{" "}
              </p>
            </IonText>
            <IonText>
              <p>. Termination</p>
            </IonText>
            <IonText>
              <h3>Interpretation</h3>
            </IonText>

            <IonText>
              <p>
                All references to singular include plural and vice versa and the
                word “includes” should be construed as “without limitation”.
              </p>
            </IonText>

            <IonText>
              <p>
                Words importing any gender shall include all the other genders.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Reference to any statute, ordinance or other law includes all
                regulations and other instruments and all consolidations,
                amendments, re-enactments or replacements for the time being in
                force.
              </p>
            </IonText>
            <IonText>
              <p>
                All headings, bold typing and italics (if any) have been
                inserted for convenience of reference only and do not define
                limit or effect the meaning or interpretation of the terms of
                this Agreement.
              </p>
            </IonText>

            <IonText>
              <h3>Introduction And Scope</h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                By using the Website or Services in any manner, you are bound by
                these Terms of Service, as well as the terms of the Agreement
                identified above. In case you do not accept the terms, then
                kindly do not use the Website. If you are agreeing with these
                Terms on behalf of a Company, organization, government, or other
                legal entity, you hereby represent and warrant that (a) you are
                legally authorized to do so, (b) the entity agrees to be legally
                bound by the Terms, and (c) neither you nor the entity is barred
                from using the Services or accepting the Terms under the laws of
                the applicable jurisdiction.
              </p>
            </IonText>

            <IonText>
              <p>
                Scope. These Terms govern your use of the Website and the
                Services. Except as otherwise specified, these Terms do not
                apply to Third-Party Products or Services, which are governed by
                their own terms of service.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                Eligibility: Certain Service of the Website is not available to
                minors under the age of 13 or to any users suspended or removed
                from the system by us for any reason.
              </p>
            </IonText>

            <IonText>
              <p>
                Electronic Communication: When you use this Website or send
                e-mails and other electronic communications from your desktop or
                mobile device to us, you are communicating with us
                electronically. By sending, you agree to receive a reply to
                communications from us electronically in the same format and you
                can keep copies of these communications for your records.
              </p>
            </IonText>

            <IonText>
              <h3>Services</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                www.igurufy.com is an online website to provide quality services
                tailored to the public need along with allowing reviewers/users
                to rate/review on Gurus regarding past experiences with them on
                either a personal or business engagement. Under this website,
                the Gurus work as Seller in order to sell their services online.
                The Customer/reviewer can purchase the services of the
                Seller/Guru through this website by subscribing various
                membership plan available on the website/ via one time cost
                fee’s as well. This website also provide the facility to the
                Customer to give reviews and ratings about the services of the
                Guru/Seller through the website on both current and past
                experiences encountered with the Guru.
              </p>
            </IonText>

            <IonText>
              <p>
                The Services are offered to the Users through various modes
                which may include issue of coupons and vouchers that can be
                redeemed for various Services.
              </p>
            </IonText>
            <IonText>
              <h3>Registration Information</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                If you access this website anonymously, you will not be required
                to create a user name. But, in order to access certain
                Resources, you may be required to provide specific information
                and to create a user ID or sign up via your Instagram username
                and password to establish an account.
              </p>
            </IonText>
            <IonText>
              <p>
                You agree that the information you provide in connection with
                establishing any account is accurate and that you will keep your
                information up-to-date. You are responsible for the security of
                all of your user names, passwords and registration information
                (such as unique account identifiers or historical billing
                information), and you are solely responsible for any use
                (authorized or not) of your accounts. You agree to notify us
                immediately about any unauthorized activity regarding any of
                your accounts or other breaches of security. We may at our
                discretion suspend or terminate any of your user names and
                passwords at any time with or without notice.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                User can also sign up with email, instagram etc. as an option.
              </p>
            </IonText>
            <IonText>
              <h3>Website Content</h3>
            </IonText>
            <IonText>
              <p>
                We publish our own content as well as links, content and
                resources provided by third parties and content that has been
                specifically commissioned by us for publication on the Websites.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                All proprietary rights relating to any third party links,
                content or resources published on the Websites remain with the
                original source or the author(s) of that material and where any
                content has been commissioned by us for publication on the
                Websites, any proprietary rights in such content remain with the
                relevant author, unless otherwise agreed or specified.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                For all other content published on the Websites, the Website
                reserves all proprietary rights including, but not limited to,
                copyrights, trademarks and other intellectual property rights in
                and to all content on the Websites; this includes all text,
                graphics, photographs, logos and/or other items that appear on
                the Websites. We also reserve its rights over the Websites’
                template, including its layout and structure. Visitors are not
                authorized to use the Website’s name, logo or likeness without
                prior consent.
              </p>
            </IonText>
            <IonText>
              <p>
                The content, links and resources on the Websites are provided
                for general information only. It is not intended to amount to
                advice on which Visitors should rely. Visitors must obtain
                professional or specialist advice before taking, or refraining
                from, any action on the basis of the content on the website.
                While we make our best possible efforts to update the website
                regularly, we do not make any kind of representations,
                warranties or guarantees, whether express or implied, that
                information provided in the Website is accurate, up to date or
                complete.
              </p>
            </IonText>

            <IonText>
              <h3>Content Responsibility</h3>
            </IonText>
            <IonText>
              <p>
                Content Responsibility. User (“You” or “Your”) are alone
                accountable for the content provided by you to the website and
                once the content is delivered by you, it is not always be
                withdrawn. It is you all your risk and accountability towards
                the reliability and quality. You represent that you have
                required permission to use the content. When posting content to
                us, please do not post content that:
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Include any vulgar, abusive, hateful or racist remark or
                language or expressions, text, any photo that are pornographic
                or in bad taste, proactively attacks of a persona, religious or
                racial nature.
              </p>
            </IonText>
            <IonText>
              <p>
                is offensive, intimidating, disapproving, grossly inflammatory,
                untrue, deceptive, fake, inaccurate, unfair, contains gross
                overstatement or unproven claims
              </p>
            </IonText>

            <IonText>
              <p>
                infringes the privacy rights of any third party is unnecessarily
                damaging or unpleasant to any individual or public
              </p>
            </IonText>
            <IonText>
              <p>
                differentiates on the basis of race, religion, national origin,
                sex, age, marital status, sexual orientation or disability, or
                refers to such matters in any manner prohibited by law
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                infringes or unsuitably encourages the damage of any municipal,
                state, federal or international law, rule, regulation or
                ordinance
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                practices or try to use another’s account, password, service or
                system except as specifically permitted by the Terms of use
                uploads or transmits viruses or other destructive, disturbing or
                disparaging files
              </p>
            </IonText>

            <IonText>
              <p>
                sends frequent messages connected to another user and/or makes
                disparaging or unpleasant comments about another individual or
                repeats prior posting of the same message under multiple emails
                or subjects
              </p>
            </IonText>

            <IonText>
              <p>Information or data which are unlawfully obtained</p>
            </IonText>

            <IonText>
              <p>
                Our staff reviews all content submitted for posting. Staff can
                revise provided information and content at their option. Any
                provided content that comprises, but is not limited to the
                following, will be amended or rejected. If recurring violations
                happen, we reserves the right to cancel user access to website
                without advanced notice.
              </p>
            </IonText>

            <IonText>
              <h3>Service Guarantee</h3>
            </IonText>
            <IonText>
              <p>By this website:</p>
            </IonText>

            <IonText>
              <p>
                {" "}
                We provide an opportunity for you to avail the offered Services
                from our website.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                We does not provide any warranty or guarantee that the Service
                descriptions are accurate, complete, reliable, current, or
                error-free. If a Services offered by the Website/s is not as
                described, your sole remedy is to intimate us about Services for
                taking further action.
              </p>
            </IonText>

            <IonText>
              <h3>Subscription</h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                Any subscription through Membership plan by the Customer for
                taking any services from this Website is between Customer and
                Website. Customer agree to take particular care when providing
                us with its details and warrant that these details are accurate
                and complete at the time of ordering.
              </p>
            </IonText>

            <IonText>
              <h3>
                <b>SUBSCRIPTION CHARGES:</b> It is agreed by the user that for
                becoming Customer:
              </h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                Customer shall pay membership fee to the Company as per the
                Membership plan of the Company.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                Subscription Payment: Preferred method of payment is PayPal,
                Credit and Debit cards are accepted via PayPal merchant
                services. Accepted cards are: Visa / Delta / Electron /
                MasterCard / Eurocard / Maestro/ American Express Debit cards
                are accepted if they have a Visa or MasterCard logo.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                When registering with this Website you may be required to
                provide a username and password. You must ensure that you keep
                these details secure and do not provide this information to a
                third party.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                We will take all reasonable care, in so far as it is in our
                power to do so, to keep the details of your order and payment
                secure, but in the absence of negligence on our part we cannot
                be held liable for any loss you may suffer if a third party
                procures unauthorised access to any data you provide when
                accessing or ordering from the Website.
              </p>
            </IonText>

            <IonText>
              <p>
                Any order for subscription to Member plan that you place with us
                is subject to acceptance by us. When you place your order online
                we will send you an email to confirm that we have received it.
                This email confirmation will be produced automatically so that
                you have confirmation of your order and subscription details.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Customers have the option to include a comment, and rate
                Guru/Seller service. They also have the right to not leave a
                review or rating at all. This is their choice.
              </p>
            </IonText>

            <IonText>
              <p>
                We may refuse or be unable to process your order/subscription
                if:
              </p>
            </IonText>
            <IonText>
              <p>
                You credit card or paypal account does not give authorization
                for the payment of purchase price.
              </p>
            </IonText>

            <IonText>
              <p>
                You do not meet the eligibility to order criteria set out above.
              </p>
            </IonText>
            <IonText>
              <p>
                You are entitled to a Membership Fee Refund as per our Refund
                Policy.
              </p>
            </IonText>
            <IonText>
              <h3>Geographic Restriction</h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                We reserve the right, but not the obligation, to limit the usage
                or supply of any service to any person, geographic region or
                jurisdiction. We may use this right as per the necessity. We
                reserve the right to suspend any Service at any time. Any offer
                to provide any Service made on this Website is invalid where
                banned.
              </p>
            </IonText>

            <IonText>
              <h3>General Conditions</h3>
            </IonText>

            <IonText>
              <p>
                {" "}
                You shall use the website for a lawful purpose and comply with
                all the applicable laws while using the website;
              </p>
            </IonText>

            <IonText>
              <p>
                Seller or Guru will need to Upload their identification and
                selfie photo in order to verify their pages.
              </p>
            </IonText>

            <IonText>
              <p>You shall not upload, any content that:</p>
            </IonText>

            <IonText>
              <p>
                Defamatory, infringes any trademark, copyright or any
                proprietary rights of any person or affect any one’s privacy,
                contain violence or hate speech, include any sensitive
                information about any person.
              </p>
            </IonText>

            <IonText>
              <p>You shall not trail, bully or harass another person;</p>
            </IonText>

            <IonText>
              <p>You may not buy or sell any Users accounts</p>
            </IonText>

            <IonText>
              <p>
                You shall not use or access the website for collecting any
                market research for some competing business;
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                You shall not misrepresent or personate any person or entity for
                any false or illegal purpose;
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                You shall not use any virus, hacking tool for interfering in the
                operation of the website or data and files of the website;
              </p>
            </IonText>
            <IonText>
              <p>
                You will not any device, scraper or any automated thing to
                access the website for any mean without taking permission.
              </p>
            </IonText>

            <IonText>
              <p>
                You will inform us about any inappropriate content or you can
                inform us if you find something illegal;
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                We reserve the right, in our sole and absolute discretion, to
                deny you access to the Website, or any portion of the Website,
                without notice, and to remove any content.
              </p>
            </IonText>

            <IonText>
              <h3>Representation And Wrranties</h3>
            </IonText>
            <IonText>
              <p>
                By become Guru/Seller, the Guru accepts and agrees to be bound
                by these terms in full. Representations and Warranties The
                Guru/Seller expressly warrants and represents that
              </p>
            </IonText>
            <IonText>
              <p>
                Seller or Guru will need to upload their identification and
                selfie photo in order to verify their pages.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Guru/Seller shall not provide any Service that is ambiguous or
                misleading or likely to deceive or mislead or that is defamatory
                or indecent or which otherwise offends the ethical and moral
                standards of society. Further, the Service does not infringes a
                copyright, trademark or otherwise infringes any intellectual
                property rights; that breaches any provision of any statute,
                regulation, bye law or any other rule or law, as may be
                applicable in force from time to time;
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                The Service of Guru/Seller will not give rise to any claim or
                action against www.igurufy.com or any of its employees,
                directors, representatives etc.
              </p>
            </IonText>
            <IonText>
              <p>
                The Service provided by the Guru/Seller through the Website
                should be provided in good faith.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                Under no circumstances, we (www.igurufy.com) shall be
                responsible in respect of any loss or damage, costs of claims,
                actions or proceedings, including the expenses incurred for
                defending the same arising against them from the offering of
                Service by the Guru/Seller in accordance with the terms and
                conditions contained herein.
              </p>
            </IonText>
            <IonText>
              <p>
                We reserve the right, in our sole and absolute discretion, to
                deny you access to the Website, or any portion of the Website,
                without notice, and to remove any content.
              </p>
            </IonText>

            <IonText>
              <h3>Exclusion OF Liability</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                In no event shall Igurufy.com, nor its owners, directors,
                employees, partners, agents, suppliers, or affiliates, be
                responsible for any indirect, incidental, special, eventful or
                exemplary damages, including without limitation, loss of
                proceeds, figures, usage, goodwill, or other intangible losses,
                consequential from (i) your use or access of or failure to
                access or use the Service; (ii) any conduct or content of any
                third party on the Service; (iii) any content attained from the
                Service; and (iv) unlawful access, use or alteration of your
                transmissions or content, whether or not based on guarantee,
                agreement, domestic wrong (including carelessness) or any other
                lawful concept, whether or not we’ve been aware of the
                possibility of such damage, and even if a cure set forth herein
                is originate to have futile of its important purpose.
              </p>
            </IonText>
            <IonText>
              <h3>Modifications To The Service Price</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                We reserve the right, in its discretion, to change, modify, add
                to, or remove portions of the Terms (collectively, “Changes”),
                at any time. We may notify you of Changes by sending an email to
                the address identified in your Account or by posting a revised
                version of the Terms incorporating the Changes to its Website.
                Your unrelenting use of the Website or Services ensuing notice
                of the Modifications (or posting of the Terms incorporating the
                Modifications in the event your email address is no longer
                lawful, is obstructed, or is otherwise not able to obtain the
                notice) will mean that you agree to the Changes. Such
                Modifications will apply prospectively beginning on the date,
                the Changes are posted to the Website.We reserve the right, in
                its discretion, to change, modify, add to, or remove portions of
                the Terms (collectively, “Changes”), at any time. We may notify
                you of Changes by sending an email to the address identified in
                your Account or by posting a revised version of the Terms
                incorporating the Changes to its Website. Your unrelenting use
                of the Website or Services ensuing notice of the Modifications
                (or posting of the Terms incorporating the Modifications in the
                event your email address is no longer lawful, is obstructed, or
                is otherwise not able to obtain the notice) will mean that you
                agree to the Changes. Such Modifications will apply
                prospectively beginning on the date, the Changes are posted to
                the Website.We reserve the right, in its discretion, to change,
                modify, add to, or remove portions of the Terms (collectively,
                “Changes”), at any time. We may notify you of Changes by sending
                an email to the address identified in your Account or by posting
                a revised version of the Terms incorporating the Changes to its
                Website. Your unrelenting use of the Website or Services ensuing
                notice of the Modifications (or posting of the Terms
                incorporating the Modifications in the event your email address
                is no longer lawful, is obstructed, or is otherwise not able to
                obtain the notice) will mean that you agree to the Changes. Such
                Modifications will apply prospectively beginning on the date,
                the Changes are posted to the Website.
              </p>
            </IonText>
            <IonText>
              <h3>Third Party Links</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                The website may comprise links to external or third-party
                websites (“External Sites”). These links are provided
                exclusively as ease to you and not as an authorization by us of
                the content on such External Sites. The content of such External
                Sites is created and used by others. You can communicate the
                site administrator for those External Sites. We are not
                accountable for the content provided in the link of any External
                Sites and do not provide any representations about the content
                or correctness of the information on such External Sites. You
                should take safety measure when you are downloading files from
                all these websites to safeguards your computer from viruses and
                other critical programs. If you agree to access linked External
                Sites, you do so at your own risk.
              </p>
            </IonText>
            <IonText>
              <h3>Personal Information and Privacy police</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                By accessing or using this Website, you approve us to use, store
                or otherwise process your personal information as per our
                Privacy Policy.Errors, Inaccuracies And Omissions
              </p>
            </IonText>
            <IonText>
              <h3>Errors, Inaccuracies And Omissions</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                Every effort have been taken to ensure that the information
                offered on this Website is accurate and error-free. We apologize
                for any errors or omissions that may have occurred. We cannot
                warrant that use of the Website will be error-free or fit for
                purpose, timely, that defects will be corrected, or that the
                site or the server that makes it available are free of viruses
                or bugs or represents the full functionality, accuracy,
                reliability of the Website and we do not make any warranty
                whatsoever, whether express or implied, relating to fitness for
                purpose, or accuracy.
              </p>
            </IonText>
            <IonText>
              <h3>Disclaimer of warranties; Limitation of liability</h3>
            </IonText>
            <IonText>
              <p>
                THE WEBSITE AND THE CONTENT ARE PROVIDED ON AN “AS IS” AND “AS
                AVAILABLE” BASIS WITHOUT ANY WARRANTIES OF ANY KIND, INCLUDING
                THAT THE WEBSITE WILL OPERATE ERROR-FREE OR THAT THE WEBSITE,
                ITS SERVERS OR THE CONTENT ARE FREE OF COMPUTER VIRUSES OR
                SIMILAR CONTAMINATION OR DESTRUCTIVE FEATURES.
              </p>
            </IonText>

            <IonText>
              <p>
                WE DISCLAIM ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
                WARRANTIES OF TITLE, MERCHANTABILITY, NON-INFRINGEMENT OF THIRD
                PARTIES’ RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE AND ANY
                WARRANTIES ARISING FROM A COURSE OF DEALING, COURSE OF
                PERFORMANCE, OR USAGE OF TRADE. IN CONNECTION WITH ANY WARRANTY,
                CONTRACT, OR COMMON LAW TORT CLAIMS: (I) WE SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, LOST
                PROFITS, OR DAMAGES RESULTING FROM LOST DATA OR BUSINESS
                INTERRUPTION RESULTING FROM THE USE OR INABILITY TO ACCESS AND
                USE THE WEBSITE OR THE CONTENT, EVEN IF WE HAVE BEEN ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGES; AND (II) ANY DIRECT DAMAGES
                THAT YOU MAY SUFFER AS A RESULT OF YOUR USE OF THE WEBSITE OR
                THE CONTENT SHALL BE LIMITED TO THE MONIES YOU HAVE PAID US IN
                CONNECTION WITH YOUR USE OF THE WEBSITE DURING THE THREE (3)
                MONTHS IMMEDIATELY PRECEDING THE EVENTS GIVING RISE TO THE
                CLAIM. THE WEBSITE MAY CONTAIN TECHNICAL INACCURACIES OR
                TYPOGRAPHICAL ERRORS OR OMISSIONS. UNLESS REQUIRED BY APPLICABLE
                LAWS, WE ARE NOT RESPONSIBLE FOR ANY SUCH TYPOGRAPHICAL,
                TECHNICAL, OR PRICING ERRORS LISTED ON THE WEBSITE. THE WEBSITE
                MAY CONTAIN INFORMATION ON CERTAIN SERVICES, NOT ALL OF WHICH
                ARE AVAILABLE IN EVERY LOCATION. A REFERENCE TO A SERVICE ON THE
                WEBSITES DOES NOT IMPLY THAT SUCH SERVICE IS OR WILL BE
                AVAILABLE IN YOUR LOCATION. WE RESERVE THE RIGHT TO MAKE
                CHANGES, CORRECTIONS, AND/OR IMPROVEMENTS TO THE WEBSITE AT ANY
                TIME WITHOUT NOTICE.
              </p>
            </IonText>

            <IonText>
              <h3>Copyright and Trademark</h3>
            </IonText>
            <IonText>
              <p>
                The Website contains material, such as software, text, graphics,
                images, designs, sound recordings, audiovisual works, and other
                the material provided by or on behalf of us (collectively
                referred to as the “Content”). The Content may be owned by us or
                third parties. Unauthorized use of the Content may violate
                copyright, trademark, and other laws. You have no rights in or
                to the Content, and you will not use the Content except as
                permitted under this Agreement. No other use is permitted
                without prior written consent from us. You must retain all
                copyright and other proprietary notices contained in the
                original Content on any copy you make of the Content. You may
                not sell, transfer, assign, license, sublicense, or modify the
                Content or reproduce, display, publicly perform, make a
                derivative version of, distribute, or otherwise use the Content
                in any way for any public or commercial purpose. The use or
                posting of the Content on any other website or in a networked
                computer environment for any purpose is expressly prohibited.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                If you violate any part of this Agreement, your permission to
                access and/or use the Content and the Website automatically
                terminates and you must immediately destroy any copies you have
                made of the Content.
              </p>
            </IonText>

            <IonText>
              <p>
                {" "}
                Our trademarks, service marks, and logos used and displayed on
                the Website are registered and unregistered trademarks or
                service marks of us. Other company, product, and service names
                located on the website may be trademarks or service marks owned
                by others (the “Third-Party Trademarks,” and, collectively with
                us, the “Trademarks”). Nothing on the website should be
                construed as granting, by implication, estoppel, or otherwise,
                any license or right to use the Trademarks, without our prior
                written permission specific for each such use. None of the
                Content may be retransmitted without our express, written
                consent for each and every instance.
              </p>
            </IonText>

            <IonText>
              <h3>Indemnification</h3>
            </IonText>
            <IonText>
              <p>
                You agree to defend, indemnify, and hold us and our officers,
                directors, employees, successors, licensees, and assigns
                harmless from and against any claims, actions, or demands,
                including, without limitation, reasonable legal and accounting
                fees, arising or resulting from your breach of this Agreement or
                your misuse of the Content or the Website. We shall provide
                notice to you of any such claim, suit, or proceeding and shall
                assist you, at your expense, in defending any such claim, suit,
                or proceeding. We reserve the right, at your expense, to assume
                the exclusive defense and control of any matter that is subject
                to indemnification under this section. In such case, you agree
                to cooperate with any reasonable requests assisting our defense
                of such matter.
              </p>
            </IonText>
            <IonText>
              <h3>Miscellaneous</h3>
            </IonText>
            <IonText>
              <p>
                {" "}
                SEVERABILITY: If any provision of these Terms is found to be
                unenforceable or invalid, that provision will be limited or
                eliminated to the minimum extent necessary so that the Terms
                will otherwise remain in full force and effect and enforceable.
              </p>
            </IonText>
            <IonText>
              <p>
                TERMINATION: Term. The Services will be provided to you can be
                cancelled or terminated by us. We may terminate these Services
                at any time, with or without cause, upon written notice. We will
                have no liability to you or any third party because of such
                termination. Termination of these Terms will terminate all of
                your Services subscriptions. Effect of Termination. Upon
                termination of these Terms for any reason, or cancellation or
                expiration of your Services: (a) We will cease providing the
                Services; (b) you will not be entitled to any refunds or usage
                fees, or any other fees, pro-rata or otherwise; (c) any fees you
                owe to us will immediately become due and payable in full, and
                (d) we may delete your archived data within 30 days. All
                sections of the Terms that expressly provide for survival, or by
                their nature should survive, will survive termination of the
                Terms, including, without limitation, indemnification, warranty
                disclaimers, and limitations of liability.
              </p>
            </IonText>

            <IonText>
              <p>
                ENTIRE AGREEMENT: These Terms are the complete and exclusive
                statement of the mutual understanding of the parties and
                supersedes and cancels all previous written and oral agreements,
                communications, and other understandings relating to the subject
                matter of these Terms, and any modifications must be in a
                writing signed by both parties, except as otherwise provided
                herein. GOVERNING LAW AND JUDICIAL RECOURSE:The terms herein
                will be governed by and construed in accordance with the laws of
                the United States of America and laws of the State of California
                without giving effect to any principles or conflicts of law. The
                courts of the State of California shall have exclusive
                jurisdiction over any dispute arising from use of the Website.
              </p>
            </IonText>
            <IonText>
              <p>
                FORCE MAJEURE: We will have no liability to you, your users, or
                any third party for any failure us to perform its obligations
                under these Terms in the event that such non-performance arises
                as a result of the occurrence of an event beyond the reasonable
                control of us, including, without limitation, an act of war or
                terrorism, natural disaster, failure of electricity supply,
                riot, civil disorder, or civil commotion or other force majeure
                event.
              </p>
            </IonText>
            <IonText>
              <p>
                HOSTING SERVICES:We have entered into arrangements with one or
                more third parties for hosting services that are essential to
                the Services incorporated within the Services and without which
                the Services could not be provided to you.
              </p>
            </IonText>
            <IonText>
              <p>
                {" "}
                ASSIGNMENT: The Company shall have the right to assign/transfer
                these presents to any third party including its holding company,
                subsidiaries, affiliates, associates and group companies,
                without any consent of the User.
              </p>
            </IonText>
            <IonText>
              <p>
                CONTACT INFORMATION:If you have any questions about these Terms,
                please contact us at info@igurufy.com
              </p>
            </IonText>
          </div>

          <div className="terms-btn">
            <IonButton className="accept-btn">Learn-more</IonButton>
            <IonButton className="accept-btn" onClick={TermsAcceptBtn}>
              Accept
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
      {/* //____  TERMS CONDITIONS CHECKBOX MODAL END ____// */}
    </>
  );
};
export default RegisterAsReviewer;
