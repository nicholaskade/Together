import "./App.css";

import { Route, Routes } from "react-router";
import { useUser } from "./components/context/UserContext";

import Home from "./components/Home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import UserProfile from "./components/UserProfile";
import MyProfile from "./components/MyProfile";
import RelationshipBoard from "./components/RelationshipBoard";
import DatePage from "./components/DatePage";

function App() {

const mapsApiKey = "AIzaSyDqQrYQMcH8E9yBZ5GVMCjLntOyqwb9SnI";

  if (useUser().user) {
      return (
        <>
          
          <Header />
          
          <div id="app-body">

            <Sidebar />
            
            <Routes>

              <Route path="/my-profile" element={<MyProfile/>}/>

              <Route path="/user-profile" element={<UserProfile/>}/>

              <Route path="/relationship-board" element={<RelationshipBoard/>}/>

              <Route path="/dates" element={<DatePage/>}/>

              <Route exact path="/" element={<Home/>}/>

            </Routes>

          </div>

        </>
      );
    } else {
      return (
        <>
            
          <Header />
          
          <div id="app-body">
            
            <Routes>
            
              <Route exact path="/" element={<Home/>}/>

            </Routes>

          </div>

        </>
      );
    };
};

export default App;