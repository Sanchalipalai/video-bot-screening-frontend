import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import VideoRecorder from "../components/VideoRecorder";
import QuestionBox from "../components/QuestionBox";

function Interview() {
    const { id } = useParams();

    const questions = [
        "Tell me about yourself",
        "Explain your previous experience",
        "Why should we hire you?"
    ];

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);

    // --- TTS (Text-to-Speech) Functionality ---
    useEffect(() => {
        // Cancel any speech that is currently playing from the previous question
        window.speechSynthesis.cancel();

        if (questions[current]) {
            const utterance = new SpeechSynthesisUtterance(questions[current]);
            
            // Optional configurations to make it sound more natural
            utterance.rate = 0.95; // Slightly slower pacing for a clearer interview vibe
            utterance.pitch = 1.0; // Standard pitch
            
            // Speak the question out loud
            window.speechSynthesis.speak(utterance);
        }

        // Cleanup: Stop speaking if the user suddenly exits the component
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [current]); // Fires automatically whenever the 'current' question index changes
    // ------------------------------------------

   function saveVideo(data) {

    console.log(
        "Saved video:",
        data
    );


    if(!data.video_url){
        console.log("No video URL received");
        return;
    }


    setAnswers(prev => [

        ...prev,

        {
            question: questions[current],
            video_url: data.video_url
        }

    ]);

}
async function submitInterview() {

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Final answers:", answers);

    await fetch(
        `${import.meta.env.VITE_API_URL}/api/submit-interview`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                candidate_id: id,
                answers: answers
            })
        }
    );

    alert("Interview Submitted");
}

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "#1e293b",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px"
            }}
        >
            <div style={{ width: "100%", maxWidth: "720px" }}>
                
                {/* Top Section Header */}
                <div 
                    style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >
                    <h1 style={{ fontSize: "1.4rem", fontWeight: "700", margin: 0 }}>
                        AI Video Interview
                    </h1>
                    <span 
                        style={{ 
                            background: "#2563eb", 
                            color: "white", 
                            padding: "6px 14px", 
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "600"
                        }}
                    >
                        Question {current + 1} of {questions.length}
                    </span>
                </div>

                {/* Smooth Progress bar */}
                <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", marginBottom: "32px", overflow: "hidden" }}>
                    <div 
                        style={{ 
                            width: `${((current + 1) / questions.length) * 100}%`, 
                            height: "100%", 
                            background: "#2563eb", 
                            transition: "width 0.3s ease" 
                        }} 
                    />
                </div>

                {/* Main Unified App Box */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)",
                        border: "1px solid #e2e8f0",
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        marginBottom: "28px"
                    }}
                >
                    {/* The Prompt Question Display */}
                    <div style={{ width: "100%" }}>
                        <QuestionBox question={questions[current]} />
                    </div>

                    {/* Styled Container Frame that perfectly bounds the Video Recorder */}
                    <div
                        style={{
                            width: "100%",
                            background: "#f8fafc", 
                            border: "1px solid #cbd5e1",
                            borderRadius: "12px",
                            padding: "16px",
                            boxSizing: "border-box",
                            display: "flex",
                            justifyContent: "center", 
                            alignItems: "center"
                        }}
                    >
                        <div style={{ borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "max-content" }}>
                           <VideoRecorder 
    onUploaded={saveVideo}
    questionNumber={current}
    candidateId={id}
/>

                        </div>
                    </div>
                </div>

                {/* Footer Toolbar Controls */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            disabled={current === 0}
                            onClick={() => setCurrent(current - 1)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                background: current === 0 ? "#f1f5f9" : "white",
                                color: current === 0 ? "#94a3b8" : "#475569",
                                fontWeight: "600",
                                cursor: current === 0 ? "not-allowed" : "pointer"
                            }}
                        >
                            Previous
                        </button>

                        <button
                            disabled={current === questions.length - 1}
                            onClick={() => setCurrent(current + 1)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                background: current === questions.length - 1 ? "#f1f5f9" : "white",
                                color: current === questions.length - 1 ? "#94a3b8" : "#475569",
                                fontWeight: "600",
                                cursor: current === questions.length - 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            Next
                        </button>
                    </div>

                    <button
                        onClick={submitInterview}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#10b981",
                            color: "white",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)"
                        }}
                    >
                        Submit Interview
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Interview;