import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebaseConfig';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(posts => {
      setPosts(posts.docs.map(post => {
        return {
          id: post.id,
          post: post.data()
        }
      }))
    });
  }, [])

  const handleSignUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then(authenticatedUser => {
        setOpenSignUp(false);
        setEmail('');
        setPassword('');
        setUsername('');
        alert('SIGNUP SUCCESSFUL');
        return authenticatedUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then(authenticatedUser => {
        setOpenSignIn(false);
        setEmail('');
        setPassword('');
        setUser(authenticatedUser);
      })
      .catch(error => {
        setOpenSignIn(true);
        return alert(error)
      }
      );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authenticatedUser => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      }
      else {
        setUser(null);
      }
    })
    return () => unsubscribe();
  }, [user, username])


  return (
    <div className="app">
      <Modal
        open={openSignUp}
        onClose={() => {
          setOpenSignUp(false)
          setUsername('')
          setEmail('');
          setPassword('');
        }}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
              </div>
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={(event) => handleSignUp(event)} >Sign Up</Button>

          </form>

        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false)
          setUsername('')
          setEmail('');
          setPassword('');
        }}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
              </div>
            </center>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={(event) => handleLogin(event)} >Login</Button>

          </form>

        </div>
      </Modal>


      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
        {/* {user && user.displayName ? <h3>Welcome {user.displayName}</h3> : null} */}
        {user && user.displayName ? (<Button onClick={() => auth.signOut()} style = {{color: "#6082a3"}}>Logout</Button>) :
          (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignUp(true)} style = {{color: "#6082a3"}}>SIGNUP</Button>
              <Button onClick={() => setOpenSignIn(true)} style = {{color: "#6082a3"}}>LOGIN</Button>
            </div>
          )
        }
      </div>
      <div className="app__posts">

        <div className="app__postsLeft">
          {posts.length === 0 ? <h3><center>Uh-Oh!! No Posts</center></h3> : posts.map(post => {
            return <Post likes = {post.post.like} imageURL={post.post.imageURL} caption={post.post.caption} username={post.post.username} key={post.id} postId = {post.id} user = {user} likedBy = {post.post.likedBy} />
          })}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {user && user.displayName ? <ImageUpload username={user.displayName} /> : <h3 style = {{padding: "10px",  color: "#6082a3"}}><center>Login To Upload</center></h3>}
    </div>
  );
}

export default App;
