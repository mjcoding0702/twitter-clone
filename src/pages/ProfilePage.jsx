import { useContext, useEffect } from "react";
import {Navbar, Container, Button, Row} from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage"
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileSideBar from "../components/ProfileSideBar";
import { AuthContext } from "../components/AuthProvider";
import { getAuth } from "firebase/auth";

export default function ProfilePage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
  
    useEffect(() => {
        if (!currentUser) navigate("/login");
    },[currentUser,navigate])
    
    const handleLogout = () => auth.signOut();

  return (
    <>
        <Container>
            <Row>
                <ProfileSideBar handleLogout={handleLogout} />
                <ProfileMidBody/>
            </Row>
        </Container>
    </>
  )
}
