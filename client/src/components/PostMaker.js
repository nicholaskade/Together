import React, { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";

import { useUser } from "./context/UserContext";
import { usePostsDispatch } from "./context/PostsContext";

function PostMaker() {
    
    const [show, setShow] = useState(false);
    const [postType, setPostType] = useState("image");
    const [text, setText] = useState("");
    const [photo, setPhoto] = useState("");
    const uid = useUser().user.id;
    const postsDispatch = usePostsDispatch();

    const [milestoneType, setMilestoneType] = useState("marriage");
    const [milestoneDate, setMilestoneDate] = useState("");

    const [partnerId, setPartnerId] = useState(0);

    const [errors, setErrors] = useState([]);

    const [significantOthers, setSignificantOthers] = useState([]);

    useEffect(() => {
        fetch(`/user/${uid}/significant_others`)
        .then(response => {
            if (response.ok) {
                response.json().then(significantOthers => setSignificantOthers(significantOthers))
                setPartnerId(significantOthers[0].id)
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    }, []);

    function handleClose() { 
        setShow(false)
        setText("");
        setPhoto("");
        setPostType("image");
    };
    
    function handleShow() { 
        setShow(true) 
    };

    function handleFile(e) {
        let file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
            console.log(file);
            if (file.size > 1000000) {
                alert("Your file is too large. Please mind our 1MB upload limit per post.");
            } else {
                setPhoto(e.target.result);
            };
        };
    
        reader.readAsDataURL(file);
      };

    let post = {
        "text": text,
        "image": photo,
        "type_of": postType,
        "user_id": uid
    };

    let milestone = {
        "creator_id": uid,
        "partner_id": partnerId,
        "date": milestoneDate,
        "type_of": milestoneType,
    };

    function handlePost() {
        if (postType !== "milestone") {
            const postRequest = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(post)
            };
    
            fetch("/posts", postRequest)
            .then(response => {
                if (response.ok) {
                    response.json().then(post => postsDispatch({
                        type: "add",
                        post: post 
                    }))
                } else {
                    response.json().then(errors => setErrors(errors))
                };
            });
        } else {
            const postRequest = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(milestone)
            };

            fetch("/milestones", postRequest)
            .then(response => {
                if (response.ok) {
                    response.json().then(post => console.log(post))
                } else {
                    response.json().then(errors => setErrors(errors))
                };
            });
        };

        handleClose();
    };

    return (
        <>
            <div id="post-maker-button-container">
                <button onClick={handleShow}>Create a Post</button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header id="post-maker-header" closeButton>
                    <Modal.Title>create a post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <div id="post-maker-container">
                            <h2>upload a </h2>
                                <select name="posts" id="post-maker" onChange={(e) => setPostType(e.target.value)}>
                                    <option value="image">photo</option>
                                    <option value="text">text post</option>
                                    <option value="milestone">milestone</option>
                                </select>
                            <h2> to togther.io</h2>
            
                        </div>
                        <br></br>            
                        <div id="post-maker-input-container">
                            { postType === "image" && 
                                <>
                                    {
                                        photo !== "" ? 
                                            <div id="post-photo-preview-container">
                                                <img src={photo} className="photo-post-preview"/>
                                            </div> 
                                                    : 
                                            <div>
                                                <p>Select your file to preview it before you upload.</p>
                                            </div>
                                    }

                                    <form>
                                        <input type="file" onChange={(e) => handleFile(e)}/>
                                        <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="500 character limit" maxLength="500" rows="7" cols="10"/>
                                    </form>
                                </>
                            }

                            { postType === "text" &&
                                <form>
                                    <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="500 character limit" maxLength="500" rows="7" cols="10"/>
                                </form>
                            }

                            { postType === "milestone" &&
                                    <form>
                                        <select name="milestone-type" id="post-maker" onChange={(e) => setMilestoneType(e.target.value)}>
                                            <option value="marriage">marriage</option>
                                            <option value="engagement">engagement</option>
                                            <option value="welcomed a baby">welcomed a baby</option>
                                            <option value="pregnancy">pregnancy</option>
                                            <option value="adopted a child">adopted a child</option>
                                            <option value="moved in together">moved in together</option>
                                            <option value="first date">first date</option>
                                            <option value="became official">became official</option>
                                        </select>

                                        <br></br>
                                        
                                        <h2>partner</h2>
                                        <select id="post-maker" onChange={(e) => setPartnerId(e.target.value)}>
                                            <option>select your partner</option>
                                            {
                                                significantOthers.length > 0 &&
                                                    significantOthers.map((so) => {
                                                        return (
                                                            <option value={so.id}>{so.full_name}</option>
                                                        )
                                                    })
                                            }
                                        </select>

                                        <br></br>
                                        
                                        <h2>date</h2>
                                        <input id="post-maker" type="date" value={milestoneDate} onChange={(e) => setMilestoneDate(e.target.value)}/>

                                    </form>
                            }
                        </div>
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose}>
                        Cancel
                    </button>
                    <button onClick={() => handlePost()}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PostMaker;