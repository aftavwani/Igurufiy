import { useState, useEffect } from "react";
import { isPlatform } from '@ionic/react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const PHOTO_STORAGE = 'photos';
export function usePhotoGallery() {

  const [livePhoto, setlivePhoto] = useState("")
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    //console.log(photo)
    const fileName = new Date().getTime() + '.png'

    const savedFileImage = await savePicture(photo, fileName);
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    Preferences.set({key: PHOTO_STORAGE,value: JSON.stringify(newPhotos)});
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: any;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    const file = await getFileFromUrl(photo?.webPath, fileName);

    setlivePhoto(file)
    return base64Data;
  };
  

  return {
    // deletePhoto,
    photos,
    takePhoto,
    livePhoto,
    setlivePhoto
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string')
      }
    };
    reader.readAsDataURL(blob);
  });
}

async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}