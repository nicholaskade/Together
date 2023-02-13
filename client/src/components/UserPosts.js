import { useEffect, useState } from "react";
import { useProfile } from "./context/ProfileContext";

function UserPosts() {

    const [userPosts, setUserPosts] = useState([]);
    const [errors, setErrors] = useState([]);

    const selectedUser = useProfile().profile;

    useEffect(() => {
        fetch(`/user/${selectedUser}/posts`)
        .then(response => {
            if (response.ok) {
                response.json().then(userPosts => setUserPosts(userPosts));
            } else {
                response.json().then(errors => setErrors(errors));
            }
        })
    }, [selectedUser]);

    const renderPosts = 
        userPosts.length > 0
            ?
                userPosts.map((post) => { 
                    if (post.type_of === "text") {
                        return (
                            <div className="post-container">
                                <div className="post">
                                    <div className="post-header">
                                        <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                        <h1>{post.user.full_name} • {post.user.username}</h1>
                                    </div>
                                    <div className="post-text">
                                        <p>{post.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    } else if (post.type_of === "image") {
                        return (
                            <div className="post-container">
                                <div className="post">
                                    <div className="post-header">
                                        <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                        <h1>{post.user.full_name} • {post.user.username}</h1>
                                    </div>
                                    <div className="post-image-container">
                                        <img alt="" className="post-image" src={post.image}/>
                                    </div>
                                    <div className="post-text">
                                        <p>{post.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }) 
                    :
                        errors.length > 0 ?
                            <h1>{errors}</h1>
                                :
                            <h1>It looks like this user hasn't made any posts yet...</h1>
    
    return (
        renderPosts
    );
};

export default UserPosts;