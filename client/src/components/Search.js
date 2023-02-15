import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useFriends } from "./context/FriendsContext";
import { useUser } from "./context/UserContext";
import { useProfileDispatch } from "./context/ProfileContext";
import { ReactComponent as SearchButton } from "../search-button.svg";

import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";

function Search() {
    const userState = useUser();
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const dispatch = useProfileDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/users")
        .then(response => {
            if (response.ok) {
                response.json().then(users => setUsers(users))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    }, []);

    function handleClose() {
        setShowAll(false);
    }

    function handleClick(id) {
        dispatch({
            type: "mount",
            profile: id
        });
        navigate("/user-profile");
        setShowSearch(false);
        setSearchTerm("");
    };

    const friends = useFriends().friends;

    function handleShowSearch() {
        setShowSearch(true);
    };

    function handleCloseSearch() {
        setShowSearch(false);
    };

    const renderFriends =
        friends ?
            friends.map((friend) => {
                return (
                    <div className="search-default-card" onClick={(e) => handleClick(friend.id)}>
                        <img src={friend.profile_picture} alt={friend.full_name} className="friend-button" onClick={(e) => handleClick(friend.id)}/>
                        <div className="search-card-names" onClick={(e) => handleClick(friend.id)}>
                            <h6 onClick={(e) => handleClick(friend.id)}>{friend.full_name}</h6>
                            <h6 onClick={(e) => handleClick(friend.id)}>{friend.username}</h6>
                        </div>
                    </div>
                )
            })
                :
            <></>

    const filteredUsers = users.filter( 
        (user) => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) 
                || 
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
        

    console.log(filteredUsers);

    const renderUsers = 
        users.length > 0 ?
            filteredUsers.slice(0, 10).map( (user) => {
                return (
                    <div className="search-default-card" onClick={(e) => handleClick(user.id)}>
                        <img src={user.profile_picture} alt={user.full_name} className="friend-button" onClick={(e) => handleClick(user.id)}/>
                        <div onClick={(e) => handleClick(user.id)} className="search-card-names">
                            <h6 onClick={(e) => handleClick(user.id)}>{user.full_name}</h6>
                            <h6 onClick={(e) => handleClick(user.id)}>{user.username}</h6>
                        </div>
                    </div>
                )
            })
                :
            <></>
    
    const renderAllUsers = 
        users.length > 0 ?
            filteredUsers.map((user) => {
                return (
                    <div className="search-default-card" onClick={(e) => handleClick(user.id)}>
                        <img src={user.profile_picture} alt={user.full_name} className="friend-button" onClick={(e) => handleClick(user.id)}/>
                        <div onClick={(e) => handleClick(user.id)} className="search-card-names">
                            <h6 onClick={(e) => handleClick(user.id)}>{user.full_name}</h6>
                            <h6 onClick={(e) => handleClick(user.id)}>{user.username}</h6>
                        </div>
                    </div>
                )
            })
                :
            <></>

    if (useFriends().friends) { 
        return (
            <>
                <SearchButton onClick={() => handleShowSearch()} id="search-button"/>
                <Offcanvas placement={"end"} show={showSearch} onHide={handleCloseSearch}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Search</Offcanvas.Title>
                        <input type="text" value={searchTerm} id="search-bar" onChange={(e) => setSearchTerm(e.target.value)}/>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {
                            searchTerm === "" ? 
                                friends ? 
                                    <>
                                        <h1>Friends</h1>
                                        {renderFriends}
                                    </>
                                            :
                                                <></>
                                :
                                    <>
                                        <h1>Search Results</h1>
                                        {renderUsers}
                                        <p id="search-show-all" onClick={() => setShowAll(true)}>Show all results...</p>
                                    </>
                        }
                    </Offcanvas.Body>
                </Offcanvas>
                
                <Modal show={showAll} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Full Search Results</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {renderAllUsers}
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </>
        );
    };
};

export default Search;