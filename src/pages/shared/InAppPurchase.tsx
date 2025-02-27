import React, { useEffect } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import {Purchases} from "@revenuecat/purchases-capacitor";

const InAppPurchase: React.FC = () => {
  const productID = 'prod00ed461d2d'; // Ensure this matches your Google Play/App Store product ID
  const REVENUECAT_API_KEY = "appl_qqNoqMViVmKhcoJbleCeSZFWJuT";

  useEffect(() => {    
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      await Purchases.setLogLevel({ level: "DEBUG" }as any); // Enable logs for debugging

      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserID: null, // Set to null for anonymous users
      });

      console.log("✅ RevenueCat initialized successfully!");
    } catch (error) {
      console.log("❌ Error initializing RevenueCat:", error);
    }
  };

  const buyProduct = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        // Find the correct package that matches your productID
        const packageToBuy = offerings.current.availablePackages.find((pkg: any) => pkg.storeProduct.identifier === productID);

        if (!packageToBuy) {
          console.warn("⚠️ No matching product found for:", productID);
          return;
        }

        const purchase = await Purchases.purchasePackage({ aPackage: packageToBuy });
        console.log("✅ Purchase successful:", purchase);
      } else {
        console.warn("⚠️ No products available for purchase.");
      }
    } catch (error) {
      console.error("❌ Purchase failed:", error);
    }
  };

  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log("✅ Restored purchases:", customerInfo);
    } catch (error) {
      console.error("❌ Failed to restore purchases:", error);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonButton expand="full" onClick={buyProduct} style={{marginTop: '200px'}}>Buy Product</IonButton>
        <IonButton expand="full" onClick={restorePurchases} color="secondary">Restore Purchases</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default InAppPurchase;
