import { useUser } from "./context/UserContext";
import { ReactComponent as AccountIcon } from "../account-icon.svg";

function AccountInfo() {
    
    const userState = useUser();

    if (userState.user.profile_picture !== null) {
        return (
            <>
                <img src={userState.user.profile_picture} className="account-center-image"/>
                <h1>{userState.user.full_name}</h1>
                <h2>{userState.user.email}</h2>
            </>
        );
    } else {
        return (
            <>
                <AccountIcon className="account-center-image"/>
                <div>
                    <h1>{userState.user.full_name}</h1>
                    <h2>{userState.user.email}</h2>
                </div>
            </>
        )
    };
};

export default AccountInfo;