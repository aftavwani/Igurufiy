import React from "react";
import { Camera, PermissionStatus } from "@capacitor/camera";

const requestCameraPermission = async () => {
  try {
    const status: PermissionStatus = await Camera.requestPermissions({
      permissions: ["camera"], // Directly use 'camera' as a string
    });

    if (status.camera === "granted") {
      //console.log("Camera permission granted");
    } else if (status.camera === "denied") {
      //console.log("Camera permission denied");
    } else {
      //console.log("Camera permission is in limited state");
    }
  } catch (error) {
    console.error("Error requesting camera permission:", error);
  }
};

const handleCameraAccess = async () => {
  await requestCameraPermission();

  const status: PermissionStatus = await Camera.checkPermissions();
  if (status.camera === "granted") {
    // console.log("You can now access the camera");
  } else {
    // return false
    // console.log("Camera access not granted");
    requestCameraPermission();
  }
};

const CameraPermission = () => {
  return handleCameraAccess();
};

export default CameraPermission;
