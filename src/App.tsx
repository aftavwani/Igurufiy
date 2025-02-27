import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Login from "./pages/shared/Login";
import Register from "./pages/shared/Register";
import RegisterAsReviewer from "./pages/shared/RegisterAsReviewer";
import TikTokRegistration from "./pages/shared/TikTokRegistration";
import RegisterAsGuru from "./pages/shared/RegisterAsGuru";
import WelcomeScreen from "./pages/WelcomeScreen";
import ForgotPassword from "./pages/ForgotPassword";
import Disclaimer from "./pages/policy/Disclaimer";
import CookiesPolicy from "./pages/policy/Cookies";
import RefundPolicy from "./pages/policy/Refund";
import PrivacyPolicy from "./pages/policy/Privacy";
import TermAndCondition from "./pages/policy/TermAndCondition";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Gurus from "./pages/Gurus";
import InstaRegistration from "./pages/shared/InstaRegistration";
import BothRegistration from "./pages/shared/BothRegistration";
import About from "./pages/About";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Message from "./pages/Message";
import UserMessages from "./pages/UserMessages";
import ClaimGuruProfile from "./pages/ClaimGuruProfile";
import EditProfile from "./pages/EditProfile";
import AdditionalInfo from "./pages/AdditionalInfo";
import RecommendInstagramGuru from "./pages/RecommendInstagramGuru";
import RecommendTiktokGuru from "./pages/RecommendTiktokGuru";
import RecommendBothGuru from "./pages/RecommendBothGuru";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import PasswordOtp from "./pages/PasswordOtp";
import GuruDetail from "./pages/GuruDetail";
import Wall from "./pages/Wall";
import ResetYourPassword from "./pages/ResetYourPassword";
import ProfileInfo from "./pages/ProfileInfo";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import AddMessage from "./pages/AddMessage";
import AccountSetting from "./pages/settings/AccountSetting";
import ResetPassword from "./pages/ResetPassword";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* Protected Route */
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import Subscription from "./pages/shared/Subscription";
import Success from "./pages/shared/Success";
import CameraPermission from "./components/permissions/CameraPermission";
import { NotifiProvider } from "./context/NotifiProvider";
import Navigate from "./components/navigation/Navigate";
import LogStatus from "./components/pusher/LogStatus";
import Authorise from "./pages/shared/Authorise";
import InAppPurchase from "./pages/shared/InAppPurchase";

const App: React.FC = () => {
  const getUserData = JSON.parse(localStorage.getItem("userData"));
  setupIonicReact();

  useEffect(() => {
    CameraPermission();
  }, []);

  return (
    <>
      <IonApp>
        <NotifiProvider>
          <IonReactRouter>
            <div>
              {/* Use PusherComponent and pass the necessary props */}
              <LogStatus
                channelName="userstatusupdated"
                eventName="status-updated"
              />
            </div>
            <IonRouterOutlet>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/InAppPurchase">
                <InAppPurchase />
              </Route>

              <Route exact path="/subscription">
                <Subscription />
              </Route>

              <Route exact path="/authorise">
                <Authorise />
              </Route>

              <Route exact path="/success">
                <Success />
              </Route>

              <Route exact path="/index">
                <WelcomeScreen />
              </Route>

              <Route exact path="/forget-password">
                <ForgotPassword />
              </Route>

              <Route exact path="/otp">
                <PasswordOtp />
              </Route>

              <Route exact path="/reset-password">
                <ResetPassword />
              </Route>

              <ProtectedRoute
                path="/reset-your-password"
                component={ResetYourPassword}
              />

              <Route exact path="/register">
                <Register />
              </Route>

              <Route exact path="/both-registration">
                <BothRegistration />
              </Route>

              <Route exact path="/reviewer-registration">
                <RegisterAsReviewer />
              </Route>

              <Route exact path="/tiktok-registration">
                <TikTokRegistration />
              </Route>

              <Route exact path="/instagram-registration">
                <InstaRegistration />
              </Route>

              <Route exact path="/guru-registration">
                <RegisterAsGuru />
              </Route>

              <Route exact path="/">
                <Redirect to={getUserData !== null ? "/home" : "/InAppPurchase"} />
              </Route>

              <Route exact path="/home" component={Home} />

              <Route exact path="/guru-detail/:name" component={GuruDetail} />

              <Route exact path="/guru-detail/wall/:name" component={Wall} />

              <Route
                exact
                path="/guru-detail/info/:name"
                component={ProfileInfo}
              />

              {/* <ProtectedRoute
            path="/guru-detail/info/:name"
            component={ProfileInfo}
          /> */}

              <Route exact path="/about">
                <About />
              </Route>

              <Route exact path="/contact">
                <Contact />
              </Route>

              <Route exact path="/blog">
                <Blog />
              </Route>

              <Route exact path="/blog-detail/:blog">
                <BlogDetail />
              </Route>

              <ProtectedRoute path="/followers/:name" component={Followers} />

              <ProtectedRoute path="/following/:name" component={Following} />

              {/* <ProtectedRoute
            path="/guru-detail/add-message/:name/send-message"
            component={AddMessage}
          /> */}

              <Route exact path="/guru-detail/add-message/:name/send-message">
                <AddMessage />
              </Route>

              <ProtectedRoute path="/message" component={Message} />

              <ProtectedRoute
                path="/guru-detail/user-messages/:thread_id"
                component={UserMessages}
              />

              <Route exact path="/claim-guru-profile">
                <ClaimGuruProfile />
              </Route>

              <ProtectedRoute path="/edit-profile" component={EditProfile} />

              <ProtectedRoute path="/profile" component={Profile} />

              <ProtectedRoute path="/notification" component={Notification} />

              <Route exact path="/recomend-instagram-guru">
                <RecommendInstagramGuru />
              </Route>

              <Route exact path="/recomend-tiktok-guru">
                <RecommendTiktokGuru />
              </Route>

              <Route exact path="/recomend-both-guru">
                <RecommendBothGuru />
              </Route>

              <ProtectedRoute
                path="/additional-info"
                component={AdditionalInfo}
              />

              <Route exact path="/explore-gurus/:category?">
                <Gurus />
              </Route>

              <ProtectedRoute
                path="/account-setting"
                component={AccountSetting}
              />

              <Route exact path="/disclaimer-policy">
                <Disclaimer />
              </Route>

              <Route exact path="/cookies-policy">
                <CookiesPolicy />
              </Route>

              <Route exact path="/refund-policy">
                <RefundPolicy />
              </Route>

              <Route exact path="/privacy-policy">
                <PrivacyPolicy />
              </Route>

              <Route exact path="/terms">
                <TermAndCondition />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </NotifiProvider>
      </IonApp>
    </>
  );
};

export default App;
