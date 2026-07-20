import React,{useEffect,useState} from "react";


function Result(){

const [data,setData]=useState(null);


useEffect(()=>{

ffetch(
`${import.meta.env.VITE_API_URL}/api/analyze-video?filename=candidate_video.webm`,
{
    method: "POST"
}
)
.then(res=>res.json())
.then(result=>setData(result));


},[]);



if(!data)
return <h2>Analyzing...</h2>



return(

<div>

<h1>Interview Result</h1>

<h3>
Communication:
{data.communication_score}%
</h3>

<h3>
Confidence:
{data.confidence_score}%
</h3>

<h3>
Technical:
{data.technical_score}%
</h3>

<h2>
Overall:
{data.overall_score}%
</h2>

<p>
{data.feedback}
</p>

</div>

)

}


export default Result;