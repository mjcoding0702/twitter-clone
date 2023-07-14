import { useContext, useEffect, useState } from "react";
import { Button, Col, Image, Row, Form, Modal } from "react-bootstrap";
import axios from 'axios';
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";
import {auth} from "../firebase"
import { AuthContext } from "../components/AuthProvider";
import { FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, linkWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "@firebase/auth";

export default function AuthPage() {
    const loginImage = "https://sig1.co/img-twitter-1";
    const url = "https://auth-back-end-chungmangjie200.sigma-school-full-stack.repl.co";

    // Possible values: null (no modal shows), "Login", "SignUp"
    const [modalShow, setModalShow] = useState(null);
    const handleShowSignUp = () => setModalShow("SignUp");
    const handleShowLogin = () => setModalShow("Login");
    const handleResetPassword = () => setModalShow("Reset");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //Reset password
    const handleResetPasswordEmail = async() => {
        try{
            const email = username;
            alert("Email to reset password sent!")
            await sendPasswordResetEmail(auth, email)
        } catch(error){
            console.log(error);
        }
    }

    //Firebase
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    //Google
    const provider = new GoogleAuthProvider();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result)
        } catch(error) {
            const errorCode = error.code;
            const errMessage = error.message;

            if (errorCode) setErrorMessage(errorCode);
            if (errMessage) setErrorMessage(errMessage);
        }
        
    }


    const facebookProvider = new FacebookAuthProvider();
    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            console.log("This is facebook")
            console.log(result)
        } catch(error) {
            console.log(error);
        }
    };
    


    useEffect(() => {
        if (currentUser){
            navigate("/profile");
        }
    },[currentUser, navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);  //It will trigger onAuthStateChanged in AuthProvider.jsx if the login is successful. If login successful, current user will be added, then it will redirect to profile page
        } catch (error) {
            const errorCode = error.code;
            const errMessage = error.message;

            if (errorCode) setErrorMessage(errorCode);
            if (errMessage) setErrorMessage(errMessage);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await createUserWithEmailAndPassword(auth,username,password);
            console.log(response.user);
        } catch (error) {
            const errorCode = error.code;
            const errMessage = error.message;

            if (errorCode) setErrorMessage(errorCode);
            if (errMessage) setErrorMessage(errorCode);
        }
    };

    const handleClose = () => {
        setModalShow(null);
        setErrorMessage("");
    }

    return (
        <Row>
            <Col sm={6}>
                <Image src={loginImage} fluid/>
            </Col>
            <Col sm={6} className="p-4">
                <i className="bi bi-twitter" style={{fontSize: 50, color: "dodgerblue"}}></i>
                <p className="mt-5" style={{fontSize: 64}}>Happening Now</p>
                <h2 className="my-5" style={{fontSize: 31}}>Join Twitter Today.</h2>
                <Col sm={5} className="d-grid gap-2">
                    <Button className="rounded-pill" variant="outline-dark" onClick={handleGoogleLogin}>
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark" onClick={handleFacebookLogin}>
                        <i className="bi bi-facebook"></i> Sign up with Facebook
                    </Button>
                    <Button className="rounded-pill" variant="outline-dark" onClick={handleFacebookLogin}>
                        <i className="bi bi-apple"></i> Sign up with Apple
                    </Button>
                    <p style={{textAlign: "center"}}>or</p>
                    <Button className="rounded-pill" onClick={handleShowSignUp}>Create an account</Button>
                    <p style={{fontSize: "12px"}}>
                        By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                    </p>

                    <p className="mt-5" style={{fontWeight: "bold"}}>Already have an account?</p>
                    <Button className="rounded-pill" variant="outline-primary" onClick={handleShowLogin}>
                        Sign in
                    </Button>
                    <Button className="rounded-pill" variant="outline-primary" onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                </Col>
                <Modal show={modalShow !== null} onHide={handleClose} animation={false} centered>
                  <Modal.Body>
                    <h2 className='mb-4' style={{ fontWeight: "bold" }}>
                      {modalShow === "SignUp"? "Create your account" :modalShow === "Login"? "Log in to your account": "Reset Password"}
                    </h2>
                    {errorMessage && <p className="text-danger text-sm">{errorMessage}</p>}
                    <Form 
                        className='d-grid gap-2 px-5' onSubmit={modalShow === "SignUp"? handleSignUp :modalShow === "Login"? handleLogin: handleResetPasswordEmail}>
                      <Form.Group className='mb-3' controlId='formBasicEmail'>
                        <Form.Control 
                            onChange={(e) => setUsername(e.target.value)}
                            type='email' 
                            placeholder='Enter Email' 
                        />
                      </Form.Group>

                      {modalShow!=="Reset" && 
                        <Form.Group className='mb-3' controlId='formBasicPassword'>
                            <Form.Control 
                                onChange={(e) => setPassword(e.target.value)}
                                type='password' 
                                placeholder='Enter Password' />
                        </Form.Group>
                      }
                        <p style={{ fontSize: "12px" }}>
                        By signing up, you agree to the terms of Service and Privacy
                        Policy, including Cookie Use. Better Tweets may use your contact
                        information, including your email address and phone number for
                        purposes outlined in our Privacy Policy, like keeping your account
                        secure and personalising our services, including ads. Learn More.
                        Others will be able to find you by email or phone number, when
                        provided, unless you choose otherwise here.
                        </p>

                        <Button className='rounded-pill' variant='outline-primary' type="submit">
                            {modalShow === "SignUp"? "Sign Up" :modalShow === "Login"? "Login": "Reset Password"}
                        </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
            </Col>
        </Row>
    )
}
