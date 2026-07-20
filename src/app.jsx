import React from "react";
import {Routes, Route} from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Login from "./pages/Login";


function App(){

return (

<Routes>

<Route
path="/"
element={<Dashboard/>}
/>

<Route
path="/login"
element={<Login/>}
/>


<Route
path="/interview/:id"
element={<Interview/>}
/>


<Route
path="/result"
element={<Result/>}
/>


</Routes>

)

}


export default App;