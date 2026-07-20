import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();



    const login = () => {


fetch(
    `${import.meta.env.VITE_API_URL}/api/login`,
    {
        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

                body:JSON.stringify({
                    email,
                    password
                })

            }
        )

        .then(res=>res.json())

        .then(data=>{


            if(data.success){

                navigate("/dashboard");

            }
            else{

                alert(
                    data.message || "Login failed"
                );

            }


        })

        .catch(error=>{

            console.log(error);

            alert(
                "Backend not connected"
            );

        });


    };



    return (

        <div
            style={{
                padding:"50px",
                fontFamily:"Arial"
            }}
        >

            <h1>
                Recruiter Login
            </h1>


            <input

                placeholder="Email"

                value={email}

                onChange={
                    e=>setEmail(e.target.value)
                }

                style={{
                    display:"block",
                    marginBottom:"15px",
                    padding:"10px",
                    width:"300px"
                }}

            />



            <input

                placeholder="Password"

                type="password"

                value={password}

                onChange={
                    e=>setPassword(e.target.value)
                }

                style={{
                    display:"block",
                    marginBottom:"20px",
                    padding:"10px",
                    width:"300px"
                }}

            />



            <button

                onClick={login}

                style={{
                    padding:"10px 25px",
                    cursor:"pointer"
                }}

            >

                Login

            </button>


        </div>

    );

}


export default Login;