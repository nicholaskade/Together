import { ReactComponent as AccountIcon } from "../account-icon.svg";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router";

function UserIcon() {

    const userState = useUser();
    const navigate = useNavigate();

    function handleClick() {
        navigate("/my-profile");
    };

    if (userState.user.profile_picture !== null) {
        return (
            <>
                <img src={userState.user.profile_picture} className="avatar-button" onClick={() => handleClick()}/>
            </>
        );
    } else {
        return (
            <>
                <AccountIcon onClick={() => handleClick()} className="avatar-button"/>
            </>
        );
    };
};

export default UserIcon;