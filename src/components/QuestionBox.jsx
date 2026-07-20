import React from "react";


function QuestionBox({question}){

return (

<div style={{
background:"#eef2ff",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px"
}}>


<h2>
{question}
</h2>


</div>

)

}


export default QuestionBox;