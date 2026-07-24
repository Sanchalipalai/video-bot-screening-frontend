import React, { useRef, useState } from "react";
import { supabase } from "../supabaseClient";

function VideoRecorder({ onUploaded, questionNumber, candidateId }) {
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);


  async function startRecording() {
    try {

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });


      setStream(mediaStream);


      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }


      const recorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 500000,
      });


      recorderRef.current = recorder;
      chunksRef.current = [];


      recorder.ondataavailable = (event) => {

        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }

      };


      recorder.onstop = async () => {

        setUploading(true);


        try {

          const blob = new Blob(
            chunksRef.current,
            {
              type: "video/webm"
            }
          );


          console.log(
            "Video size:",
            blob.size
          );


          const fileName =
            `candidate_${candidateId}/question_${questionNumber}_${Date.now()}.webm`;


          console.log(
            "Uploading:",
            fileName
          );



          // Upload to Supabase

          const { data, error } =
            await supabase.storage
              .from("interview-videos")
              .upload(
                fileName,
                blob,
                {
                  contentType: "video/webm"
                }
              );


          if (error) {

            console.error(
              "Supabase upload error:",
              error
            );

            alert("Video upload failed");
            return;

          }


          console.log(
            "Supabase upload success:",
            data
          );



          const { data: urlData } =
            supabase.storage
              .from("interview-videos")
              .getPublicUrl(fileName);



          const videoUrl =
            urlData.publicUrl;



          console.log(
            "Video URL:",
            videoUrl
          );



          // Send video to backend for transcription + scoring

         const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/upload-interview/${candidateId}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_url: videoUrl,
      question: `Question ${questionNumber + 1}`,
    }),
  }
);



          const result =
            await response.json();



          console.log(
            "Backend upload result:",
            result
          );



          if (onUploaded) {

            onUploaded(result);

          }


        } catch (err) {

          console.error(
            "Error during upload process:",
            err
          );


          alert(
            "An error occurred during upload."
          );


        } finally {

          setUploading(false);

        }

      };


      recorder.start();

      setRecording(true);



    } catch (error) {

      console.error(
        "Camera access error:",
        error
      );


      alert(
        "Camera permission denied or device not found."
      );

    }
  }



  function stopRecording() {


    if (
      recorderRef.current &&
      recorderRef.current.state !== "inactive"
    ) {

      recorderRef.current.stop();

    }



    if (stream) {

      stream
        .getTracks()
        .forEach(
          (track) => track.stop()
        );


      setStream(null);

    }


    setRecording(false);

  }




  return (

    <div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width="500"
        style={{
          borderRadius: "10px",
          border: "1px solid #ccc",
          backgroundColor: "#000",
        }}
      />


      <br />
      <br />


      {!recording ? (

        <button
          onClick={startRecording}
          disabled={uploading}
        >

          {uploading
            ? "Uploading..."
            : "Start Recording"}

        </button>


      ) : (

        <button onClick={stopRecording}>
          Stop & Upload
        </button>

      )}


    </div>

  );

}


export default VideoRecorder;