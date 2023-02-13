import { useHistory } from "react-router-dom";

import SignUp from "./SignUp";
import SignIn from "./SignIn";

import Timeline from "./Timeline";
import PostMaker from "./PostMaker";

import { useUser } from "./context/UserContext";

function Home() {

    const userState = useUser();

    if (userState.user) {
        return (
            <div id="timeline">
                <PostMaker />
                <Timeline />
            </div>
        )
    } else {
        return (
            <>
            </>
        )
    }

};

export default Home;