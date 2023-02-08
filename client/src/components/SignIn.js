import { useState } from 'react';
import { useUserDispatch, useUser } from "./context/UserContext";
import Modal from 'react-bootstrap/Modal';

function SignIn() {

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const dispatch = useUserDispatch();
    const userState = useUser();

    const [show, setShow] = useState(false);

    function handleClose() { setShow(false) };
    function handleShow() { setShow(true) };


    function handleSubmit(e){
        // e.preventDefault();
        handleClose();

        const formData = {
            "email": email, 
            "password": password
        };
        // signs user in 
        fetch("/signin", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            }, 
            body: JSON.stringify(formData),
        })
        .then(res => {
            if(res.ok){
                res.json().then(user => {
                    dispatch({
                        type: "added",
                        user: user,
                    });
                   localStorage.setItem("currentUser", user.id);
                });
            } else {
                res.json().then(data => setErrors(data.errors))
            };
        });
        console.log(formData);
    };

    const handleSignOut = () => {
        fetch("/signout", {
            method: "DELETE"
        });

        localStorage.removeItem("user");
        dispatch({
            type: "removed",
            user: null, id: null
        })
    };

    const signInForm = 
            userState.user ?
                <p id="sign-in-link" onClick={handleSignOut}>Sign Out</p>
                    :
                <>
                    <p id="sign-in-link" onClick={() => handleShow()}>Sign In</p>
                    <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <label>
                                Email
                            </label>
                            <input type='text' placeholder="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            
                            <label>
                                Password
                            </label>
                            <input type='password' placeholder="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleClose}>
                        Close
                        </button>
                        <button onClick={() => handleSubmit()}>
                        Sign In
                        </button>
                    </Modal.Footer>
                    </Modal>
                </>

    return (
        signInForm
        // <>
        //     <p id="sign-in-link" onClick={() => handleShow()}>Sign In</p>
        //     <Modal show={show} onHide={handleClose}>
        //     <Modal.Header closeButton>
        //         <Modal.Title>Sign In</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>
        //         <form>
        //             <label>
        //                 Email
        //             </label>
        //             <input type='text' placeholder="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    
        //             <label>
        //                 Password
        //             </label>
        //             <input type='password' placeholder="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        //         </form>
        //     </Modal.Body>
        //     <Modal.Footer>
        //         <button onClick={handleClose}>
        //         Close
        //         </button>
        //         <button onClick={() => handleSubmit()}>
        //         Sign In
        //         </button>
        //     </Modal.Footer>
        //     </Modal>
        // </>
    );
};

export default SignIn;