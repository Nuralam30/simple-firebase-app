
import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {

  const provider = new GoogleAuthProvider();
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
    signInWithPopup(auth, provider)
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
    if(user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
      .then( res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch( err => {
        var errMessage = err.message;
        const newUserInfo = {...user};
        newUserInfo.error = errMessage;
        newUserInfo.success = false;
        setUser(newUserInfo);
      })
    }
    e.preventDefault();
  }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out </button> :
                          <button onClick={handleSignIn}>Sign In </button>
      }
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
        <button type='submit'>Login</button>
      </form>

      <p className="error-message">{user.error}</p>
      {user.success && <p className="success-message">User created successfully</p>}

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
