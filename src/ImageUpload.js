import React, {useState} from 'react'
import { Button } from '@material-ui/core';
import {storage, db} from './firebaseConfig';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload (props) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (event) => {
        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
        const upload = storage.ref(`images/${image.name}`).put(image)
        upload.on("state_changed", snapshot => {
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setProgress(progress);
         },
         error=> {
            alert(error.message)
        },
        ()=> {
            storage.ref("images").child(image.name).getDownloadURL().then(url=> {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageURL: url,
                    username: props.username,
                    like: 0,
                    likedBy: []
                })

                setProgress(0);
                setCaption('');
                setImage('');
            })
         }
        )
    }

    return (
        <div className = "imageUpload">
            <progress style = {{width: '100%'}} value= {progress} max="100" />
            <input type="text" placeholder="Enter a caption..." onChange = {event=> setCaption(event.target.value)} value = {caption}/>
            <input type="file" onChange = {handleChange}/>
            <Button onClick = {handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
