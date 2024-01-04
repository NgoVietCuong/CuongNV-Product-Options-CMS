import axios from "axios";
import { useState, useContext } from "react";
import {   
  DropZone,
  LegacyStack,
  Thumbnail,
  Banner,
  List,
  Text, } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function ImageUpload() {
  const { shopDomain } = useContext(OptionSetContext);
  const [file, setFile] = useState();
  const [rejectedFile, setRejectedFile] = useState();
  const [isUploading, setIsUploading] = useState(false);

  console.log("rejectedFile", rejectedFile)

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
        console.log("resposne", response)
        setIsUploading(false);
        setFile(acceptedFiles[0]);
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      setRejectedFile(_rejectedFiles[0]);
    }
  };

  const fileUpload = !isUploading && <DropZone.FileUpload actionHint="Accepts .gif, .svg, .jpg, and .png" />;

  const uploadedFile = file > 0 && (
    <LegacyStack vertical>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </LegacyStack>
      ))}
    </LegacyStack>
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
    <Banner >
      <p>
        Image uploading
      </p>
    </Banner>
  )

  return (
    <LegacyStack vertical>
      {errorMessage}
      <DropZone accept="image/*" type="image" onDrop={handleDrop}>
        {uploadingMessage}
        {uploadedFile}
        {fileUpload}
      </DropZone>
    </LegacyStack>
  );
}