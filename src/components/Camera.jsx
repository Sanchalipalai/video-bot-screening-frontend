import React, { useRef, useEffect } from "react";

function Camera({ videoRef }) {

  useEffect(() => {

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then((stream) => {

        videoRef.current.srcObject = stream;

      })
      .catch((error) => {
        console.log("Camera error:", error);
      });

  }, [videoRef]);


  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      width="500"
    />
  );
}

export default Camera;