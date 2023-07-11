import { useContext, useEffect } from "react";
import {Navbar, Container, Button, Row} from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileSideBar from "../components/ProfileSideBar";
import { AuthContext } from "../components/AuthProvider";
import {auth} from "../firebase"

export default function ProfilePage() {
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
