import { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";

import FriendBubble from "./FriendBubble";

function Sidebar() {

    const uid = useUser().user.id;

    if (useUser().user) {
        return (
            <div id="friend-sidebar">
                <h1 id="friends-header">Friends</h1>
                <FriendBubble />
            </div>
        )
    }
};

export default Sidebar;