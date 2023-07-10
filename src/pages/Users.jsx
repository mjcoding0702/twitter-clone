import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Nav, Navbar, Table } from "react-bootstrap";
import jwt_decode from "jwt-decode";

/* <tr>
    <td></td>
    <td>@mdo</td>
    <td>
        <Button variant="primary" className="me-3">Follow</Button>
        <Button variant="danger">Unfollow</Button>
    </td>
</tr> */

function UserCard({users}) {
    const [userId, setUserId] = useState(null);
    const url = "https://twitter-api-chungmangjie200.sigma-school-full-stack.repl.co";

    //Get current userId
    console.log(users)
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        console.log(`this is the token - ${token}`);
        if (token) {
          const decodedToken = jwt_decode(token);
          setUserId(decodedToken.id);
          console.log(`Here's the user ID: ${userId}`)
        }
      }, [userId]);

    //Handle follow
    const handleFollow = async (followedId) => {
        try {
            const response = await axios.post(`${url}/follow`, {follower_id: userId, followed_id: followedId});
            
            // if request is successful, status code will be 200-299
            alert(response.data.message)
        } catch (error) {
            // This is where you handle your error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // you can tailor the message here
                if (error.response.status === 400){
                    alert("You're already following this person.");
                } else if (error.response.status === 500) {
                    alert("Something went wrong. Please try again.");
                } else {
                    alert(`Error ${error.response.status}: ${error.response.data.message}`);
                }

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in Node.js
                alert('Request made, but no response received');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Error in setting up the request');
            }
        }
    }

    //Handle unfollow
    const handleUnfollow = async (followedId) => {
        try {
            const response = await axios.delete(`${url}/unfollow`, {data: {follower_id: userId, followed_id: followedId}})

            alert(response.data.message);
        } catch (error) {
            // This is where you handle your error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // you can tailor the message here
                if (error.response.status === 400){
                    alert("You are not following this person.");
                } else if (error.response.status === 500) {
                    alert("Something went wrong. Please try again.");
                } else {
                    alert(`Error ${error.response.status}: ${error.response.data.message}`);
                }

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in Node.js
                alert('Request made, but no response received');
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Error in setting up the request');
            }
        }
    }


    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Username</th>
                <th>Follow User</th>
                </tr>
            </thead>
            <tbody>
                {users.filter(user => user.id !== userId).map((user, index) => {
                    return (
                        <tr key={user.username}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>
                                <Button variant="primary" className="me-3" onClick={() => handleFollow(user.id)}>Follow</Button>
                                <Button variant="danger" onClick={() => handleUnfollow(user.id)}>Unfollow</Button>
                            </td>
                        </tr>
                    )
                })}
                
            </tbody>
        </Table>
    )
}

export function Users() {
    const [allUsername, setAllUsername] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.id);
        }
    }, []);


    useEffect(() => {
        const getUser = async () => {
            const url = 'https://twitter-api-chungmangjie200.sigma-school-full-stack.repl.co';
            try {
                const response = await axios.get(`${url}/getuser`);
                setAllUsername(response.data);
            } catch(error) {
                console.log("get user error triggered")
                console.log(error.stack);
            } 
        }

        if(userId) {
            getUser();
            console.log('getUser function ran ok')
        }
    }, [userId]); // include getUser as a dependency to the useEffect hook

    return (
        <Container>
            <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/login">Users</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/profile">Profile Page</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>

            <h1>User Page</h1>
            <UserCard users={allUsername}/>

        </Container>
    )
}