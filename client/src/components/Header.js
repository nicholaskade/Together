import { Link } from "react-router-dom";

import { useUser } from "./context/UserContext";

import UserIcon from "./UserIcon";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Search from "./Search";

import { ReactComponent as AppLogo } from "../together_logo.svg";

function Header() {

    const userState = useUser();
    console.log(useUser());

    const header = 
        userState.user ?
                <div id="header">
                    <div id="logo-container">
                        <Link to="/">
                            <AppLogo id="logo-svg"/>
                        </Link>
                        <h1 id="logo-text">together.io</h1>
                    </div>
                    <div id="signed-out-header">
                        <Search />
                        <UserIcon />
                        <SignIn />
                    </div>
                </div>
            :
                <div id="header">
                    <div id="logo-container">
                        <Link to="/">
                            <AppLogo id="logo-svg"/>
                        </Link>
                        <h1 id="logo-text">together.io</h1>
                    </div>
                    <div id="signed-out-header">
                        <SignIn />
                        <SignUp />
                    </div>
                </div>

    return (
        header
    );

};

export default Header;