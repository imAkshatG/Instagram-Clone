import React from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imageURL, likes, likedBy }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => {
                    return {
                        comment: doc.data(),
                        id: doc.id
                    }
                }));
            })
        }
        return () => unsubscribe();
    }, [postId]);


    const commentHandler = (event, postId) => {
        event.preventDefault();
        if (user === null) {
            alert('Login To Add Comments');
            return;
        }
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }

    const likeHandler = (event, postId) => {
        const tag = event.target.tagName.toLowerCase();
        event.preventDefault();
        if (user == null) {
            alert('Login To Like')
            return;
        }
        if (tag === 'p') {
            likedBy.push(user.displayName);
            db.collection("posts").doc(postId).update({
                like: likes + 1,
                likedBy: likedBy
            });
        }

        else if(tag === 'b') {
            const likeBy = likedBy.filter(like=> {
               return like!==user.displayName
            });
            db.collection("posts").doc(postId).update({
                like: likes-1,
                likedBy: likeBy
            });
        }
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" alt="" src={imageURL} />
            <h4 className="post__text"><strong style={{ margin: '5px' }}>{username}</strong>{caption}</h4>
            <button id="likeButton" onClick={(event) => likeHandler(event, postId)} className="post__liked">{ user && (likedBy.length !== 0 && likedBy.includes(user.displayName)) ? <b>Liked By You</b> : <p>Likes</p>}</button>
            <b style={{ marginLeft: "5px" }}>{likes}</b>
            <div className="post__comments">
                {comments.map(comment => {
                    return (<p key={comment.comment.id}>
                        <b>{comment.comment.username} </b> {comment.comment.text}
                    </p>)
                })}

            </div>
            <form className="form__comments">
                <input
                    type="text"
                    className="post__input"
                    placeholder="Add comments..."
                    value={comment} onChange={event =>
                        setComment(event.target.value)} />
                <button className="post__button" disabled={!comment} type="submit" onClick={(event) => commentHandler(event, postId)}>Post</button>
            </form>
        </div>
    )
}

export default Post
