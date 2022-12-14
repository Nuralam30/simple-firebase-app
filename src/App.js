
import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {

  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const [newUser, setNewUser] = useState(false)
  const [ user, setUser ] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    password : '',
    userImage : '',
    text : '',
    error : '',
    success : false
  });

  const handleSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
    .then(res => {
      const { displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        userImage : photoURL
      }
      setUser(signedInUser)
    })
    .catch( err => console.log(err))
  }

  const handleSignOut = () =>{
    const auth = getAuth()
    signOut(auth)
    .then(res => {
      const signedOutUser = {
        isSignedIn : false,
        name : '',
        email : '',
        userImage : ''
      }
      setUser(signedOutUser)
    })
    .catch( err => console.log(err))
  } 

  const handleFbSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        
        const user = result.user;
        console.log(user)
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage)
      });
  }

  const handleBlur = (e) =>{
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const passLength = e.target.value.length > 8;
      const isPasswordValid = /\d{1}/.test(e.target.value);
      isFieldValid = passLength && isPasswordValid;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }

  const handleText = () =>{
    const newUserInfo = {...user};
    newUserInfo.text = true;
    setUser(newUserInfo);
  }
  
  const handleSubmit = (e) =>{
    if(newUser && user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then( res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserInfo(user.name)
      })
      .catch( err => {
        var errMessage = err.message;
        const newUserInfo = {...user};
        newUserInfo.error = errMessage;
        newUserInfo.success = false;
        setUser(newUserInfo);
      })
    }
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then(res =>{
        const userSignIn = {...user};
        userSignIn.error = '';
        userSignIn.success = true;
        setUser(userSignIn);
        console.log('user info', res.user)
      })
      .catch(err =>{
        var errMessage = err.message;
        const userSignIn = {...user};
        userSignIn.error = errMessage;
        userSignIn.success = false;
        setUser(userSignIn);
      })
    }
    e.preventDefault();
  }

  const updateUserInfo = (name) =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName : name
    })
    .then(res => {
      console.log('user info updated successfully');
    })
    .catch((err) => {
      const errMessage = err.message;
      console.log(errMessage)
    });
  }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out </button> :
                          <button onClick={handleSignIn}>Sign In </button>
      }
      <br />
      <button onClick={handleFbSignIn}> Sign in with Facebook</button>
      <br />
      <br />
      <span><input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />New User Register</span>
      <form action="" onSubmit={handleSubmit}>
        {newUser && <input type="text" onBlur={handleBlur} placeholder='Enter your name....' name="name" id="userName" />}
        <br /><br />
        <input type="email" onBlur={handleBlur} placeholder='Enter your email....' name="email" id="email" required />
        <br /><br />
        <input type="password" onBlur={handleBlur} onFocus={handleText} placeholder='Enter password....' name="password" id="pass" required />
        <br />
        {
          user.password ? <span className='pass-text green-text'>***must include a digit and 8 character***</span> :
                      <span className='pass-text red-text'>***must include a digit and 8 character***</span>
        }
        <br /><br />
        <button type='submit'>{newUser ? 'Sign Up' : 'Sign in'}</button>
      </form>

      <p className="error-message">{user.error}</p>
      {user.success && <p className="success-message">User {newUser ? 'created' : 'Logged In'} successfully</p>}

      {
        user.isSignedIn && <div>
            <p>Welcome <b> { user.name } </b></p>
            <p>Your email : { user.email} </p>
            <img src={user.userImage} alt="" />
          </div>
      }
    </div>
  );
}

export default App;
