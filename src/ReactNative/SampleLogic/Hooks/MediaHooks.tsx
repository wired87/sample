import { useState } from 'react';
import {ImagePickerResult} from "expo-image-picker";
import {DocumentPickerResult} from "expo-document-picker";

export const useMedia = () => {
  const [pickedImage, setPickedImage] = useState<ImagePickerResult | undefined>(undefined);
  const [doc, setDoc] = useState<DocumentPickerResult | undefined>(undefined);

  const updatePickedImage = (image: ImagePickerResult | undefined) => {
    setPickedImage(image);
  }

  const updateDoc = (doc: DocumentPickerResult | undefined) => {
    setDoc(doc);
  }

  return {
    pickedImage, updatePickedImage,
    doc, updateDoc
  };
}


