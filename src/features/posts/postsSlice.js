import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import jwtDecode from "jwt-decode";
import { db } from "../../firebase"

const BASE_URL = "https://twitter-api-chungmangjie200.sigma-school-full-stack.repl.co";


//Async thunk to like post
export const likePost = createAsyncThunk(
    "posts/likePost",
    async({userId, postId}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = [...postData.likes, userId] //Append new user into the likes array
                
                await setDoc(postRef, {...postData, likes})  //Rewrite the data inside posts with userId
            }

            return {userId, postId};
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
);

//Async thunk to remove post
export const removeLikeFromPost = createAsyncThunk(
    "posts/removeLikeFromPost",
    async({userId, postId}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = postData.likes.filter((id) => id!== userId) //create a new array that doesn't contain the userId who removed like
                
                await setDoc(postRef, {...postData, likes})  //Rewrite the data inside posts with userId
            }

            return {userId, postId};
        } catch(error) {
            console.error(error);
            throw error;
        }
    }
);

// Async thunk for fetching a user's posts
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`);

            const querySnapshot = await getDocs(postsRef);
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        return docs;
        } catch(error){
            console.error(error);
            throw error;
        } 
    }
);

// Async thunk for saving post
export const savePost = createAsyncThunk(
    "posts/savePost",
    async ({userId, postContent}) => {
       try {
        const postsRef = collection(db, `users/${userId}/posts`);
        console.log(`users/${userId}/posts`);
        const newPostRef = doc(postsRef);
        console.log(postContent);
        await setDoc(newPostRef, {content: postContent, likes: []});
        const newPost = await getDoc(newPostRef);

        const post = {
            id: newPost.id,
            ...newPost.data(),
        };

        return post;
       } catch(error){
        console.error(error);
        throw error;
       }
    }
)

// Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: {posts: [], loading: true},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPostsByUser.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        })
        .addCase(savePost.fulfilled, (state, action) => {
            state.posts = [action.payload, ...state.posts];
        })
        .addCase(likePost.fulfilled, (state,action) => {
            const { userId, postId } = action.payload;

            const postIndex = state.posts.findIndex((post) => post.id === postId);

            if (postIndex !== -1){ //If post is found
                state.posts[postIndex].likes.push(userId); //Add new userId to the likes array
            }
        })
        .addCase(removeLikeFromPost.fulfilled, (state,action) => {
            const { userId, postId } = action.payload;

            const postIndex = state.posts.findIndex((post) => post.id === postId);

            if (postIndex !== -1){ //If post is found
                state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
                    (id) => id !== userId
                ); //Add new userId to the likes array
            }
        })
    },
});

export default postsSlice.reducer;