import axios from "axios";
import { useState, useContext } from "react";
import {   
  DropZone,
  LegacyStack,
  Banner,
  List,
  Button
} from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function ImageUpload({ image, setImage }) {
  const { shopDomain } = useContext(OptionSetContext);
  const [rejectedFile, setRejectedFile] = useState();
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (_dropFiles, acceptedFiles, _rejectedFiles) => {
    if (acceptedFiles[0]) {
      setIsUploading(true);
      setRejectedFile();
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
      formData.append('public_id_prefix', `${process.env.NEXT_PUBLIC_UPLOAD_PRESET}/${shopDomain}`);
      try {
        const response = await axios({
          url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          method: 'post',
          data: formData
        });
        setIsUploading(false);
        setImage(response.data.secure_url);
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      setImage("");
      setRejectedFile(_rejectedFiles[0]);
    }
  };

  const uploadedFile = image && (
    <Button onClick={() => setImage("")}>Delete image</Button>
  );

  const errorMessage = rejectedFile && (
    <Banner title="The following images couldn’t be uploaded:" status="critical">
      <List type="bullet">
        <List.Item>
          {`"${rejectedFile.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
        </List.Item>
      </List>
    </Banner>
  );
  
  const uploadingMessage = isUploading && (
    <Banner status="info">
      <p>
        Image uploading...
      </p>
    </Banner>
  )

  return (
    <LegacyStack vertical>
      {errorMessage}
      {uploadingMessage}
      {uploadedFile}
      {(!image && !isUploading) && (
        <DropZone accept="image/*" type="image" onDrop={handleDrop}>
          <DropZone.FileUpload actionHint="Accepts .gif, .svg, .jpg, and .png" />
        </DropZone>
      )}
    </LegacyStack>
  );
}