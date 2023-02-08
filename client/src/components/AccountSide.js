import { ReactComponent as AccountIcon } from "../account-icon.svg";

import Offcanvas from "react-bootstrap/Offcanvas";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountInfo from "./AccountInfo";

import { useUser } from "./context/UserContext";

function AccountSide() {

    const userState = useUser();
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    function handleShowAccountInfo() {
        setShowAccountInfo(true);
    };

    function handleCloseAccountInfo() {
        setShowAccountInfo(false);
    };

    if (userState.user.profile_picture !== null) {
        return (
            <>
                <img src={userState.user.profile_picture} className="avatar-button" onClick={() => handleShowAccountInfo()}/>
                <Offcanvas placement={"end"} show={showAccountInfo} onHide={handleCloseAccountInfo}>
                    <Offcanvas.Header closeButton>
                        <Link to="/account-center">
                            <Offcanvas.Title>My Account</Offcanvas.Title>
                        </Link>
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
                    <Link to="/account-center">
                        <Offcanvas.Title>My Account</Offcanvas.Title>
                    </Link>
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