import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { savePost, updatePost } from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";

export default function NewPostModal({show, handleClose, postId, originalPostContent}) {
    const [newPostContent, setNewPostContent]  = useState(originalPostContent);
    const [newFile, setNewFile] = useState(null);
    const dispatch = useDispatch();
    const {currentUser} = useContext(AuthContext);
    const userId = currentUser.uid;

    useEffect(() => {
        setNewPostContent(originalPostContent);
    }, [originalPostContent]);

    const handleUpdate = () => {
        console.log("here's inside handle update")
        console.log(postId)
        console.log(newPostContent) //test22
        console.log(newFile) //null


        dispatch(updatePost({userId, postId, newPostContent, newFile}));
        handleClose();
        setNewFile(null);
    }

    const handleNewFileChange = (e) => {
        setNewFile(e.target.files[0]);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postContent">
                            <Form.Control
                                defaultValue={originalPostContent}
                                as="textarea"
                                rows={3}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <br/>
                            <Form.Control type="file" onChange={handleNewFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="primary"
                        className="rounded-pill"
                        onClick={handleUpdate}
                    >Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}