import React, { useRef, useState } from "react";

function VideoRecorder({
    onUploaded,
    questionNumber,
    candidateId
}) {

    const videoRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [stream, setStream] = useState(null);
    const [recording, setRecording] = useState(false);


    async function startRecording() {

        try {

            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });


            setStream(mediaStream);


            videoRef.current.srcObject = mediaStream;


            const recorder =
                new MediaRecorder(
                    mediaStream,
                    {
                        mimeType: "video/webm"
                    }
                );


            recorderRef.current = recorder;

            chunksRef.current = [];


            recorder.ondataavailable = (event)=>{

                if(event.data.size > 0){
                    chunksRef.current.push(event.data);
                }

            };


            recorder.onstop = async ()=>{


                const blob =
                    new Blob(
                        chunksRef.current,
                        {
                            type:"video/webm"
                        }
                    );


                console.log(
                    "Video size:",
                    blob.size
                );


                const formData =
                    new FormData();


                formData.append(
                    "video",
                    blob,
                    `question_${questionNumber}_${Date.now()}.webm`
                );


                formData.append(
                    "question",
                    `Question ${questionNumber + 1}`
                );


for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
}
                const response =
                    await fetch(
                        `http://127.0.0.1:8000/api/upload-interview/${candidateId}`,
                        {
                            method:"POST",
                            body:formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Upload result:",
                    data
                );


                if(onUploaded){
                    onUploaded(data);
                }


            };


            recorder.start();


            setRecording(true);


        }
        catch(error){

            console.log(error);

            alert(
                "Camera permission denied"
            );

        }

    }



    function stopRecording(){


        if(!recorderRef.current)
            return;



        recorderRef.current.stop();


        if(stream){

            stream
            .getTracks()
            .forEach(
                track=>track.stop()
            );

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
                    borderRadius:"10px",
                    border:"1px solid #ccc"
                }}

            />


            <br/><br/>


            {
                !recording ?

                <button
                    onClick={startRecording}
                >
                    Start Recording
                </button>

                :

                <button
                    onClick={stopRecording}
                >
                    Stop & Upload
                </button>

            }


        </div>

    );

}


export default VideoRecorder;