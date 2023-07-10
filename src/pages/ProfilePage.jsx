import { useEffect } from "react";
import {Navbar, Container, Button, Row} from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage"
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileSideBar from "../components/ProfileSideBar";

export default function ProfilePage() {
    const [authToken, setAuthToken] = useLocalStorage("authToken", "");
    const navigate = useNavigate();
  
    // Check for authToken immediately upon component mount and whenever autToken changes
    useEffect(() => {
        if (!authToken){
            navigate("/login"); //redirect to login if no auth token is present
        }
    }, [authToken, navigate]);

    const handleLogout = () => {
        setAuthToken(""); //clear token from localstorage
    }

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
