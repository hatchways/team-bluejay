import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@material-ui/core";

function Dropzone({ setImageFile, setPreviewImage }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    },
    [setImageFile, setPreviewImage]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/png, image/jpg, image/jpeg",
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <Button color="default" variant="contained">
          {isDragActive
            ? "Drop the image here ..."
            : "Drag 'n' drop your image here, or click to select"}{" "}
        </Button>
      }
    </div>
  );
}

export default Dropzone;
