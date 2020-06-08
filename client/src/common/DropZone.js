import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@material-ui/core";

function Dropzone({ setImage }) {
  const onDrop = useCallback((acceptedFiles) => {
    setImage(acceptedFiles[0]);
    console.log("added a file");
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
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
