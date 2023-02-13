import { ReactComponent as AccountIcon } from "../account-icon.svg";

import Offcanvas from "react-bootstrap/Offcanvas";
import { useState, useEffect } from "react";
import AccountInfo from "./AccountInfo";

import { useUser } from "./context/UserContext";

import { useNavigate } from "react-router";

import { useProfileDispatch } from "./context/ProfileContext";

function AccountSide() {

    const userState = useUser();
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    function handleShowAccountInfo() {
        setShowAccountInfo(true);
    };

    function handleCloseAccountInfo() {
        setShowAccountInfo(false);
        dispatch({
            type: "unmount"
        });
    };

    const dispatch = useProfileDispatch();
    const navigate = useNavigate();
    const uid = useUser().id;

    console.log(uid);

    function handleClick() {
        navigate("/my-profile");
        setShowAccountInfo(false);
    };

    if (userState.user.profile_picture !== null) {
        return (
            <>
                <img src={userState.user.profile_picture} className="avatar-button" onClick={() => handleShowAccountInfo()}/>
                <Offcanvas placement={"end"} show={showAccountInfo} onHide={handleCloseAccountInfo}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="my-account-header" onClick={() => handleClick()}>My Account</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <AccountInfo />
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        )
    } else {
        return (
            <>
                <AccountIcon onClick={() => handleShowAccountInfo()} className="avatar-button" />
                <Offcanvas placement={"end"} show={showAccountInfo} onHide={handleCloseAccountInfo}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="my-account-header" onClick={() => handleClick()}>My Account</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <AccountInfo />
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        )
    };
};

export default AccountSide;