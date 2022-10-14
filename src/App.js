
import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

const app = initializeApp(firebaseConfig);

function App() {

  const provider = new GoogleAuthProvider();
  const [ user, setUser ] = useState({
    isSignedIn : false,
    name : '',
    emailAddress : '',
    userImage : ''
  });

  const handleSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then(res => {
      const { displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        emailAddress : email,
        userImage : photoURL
      }
      setUser(signedInUser)
    })
    .catch( err => console.log(err))
  }

  return (
    <div className="App">
      <button onClick={handleSignIn}>Sign In </button>
      {
        user.isSignedIn && <div>
            <p>Welcome <b> { user.name } </b></p>
            <p>Your email : { user.emailAddress} </p>
            <img src={user.userImage} alt="" />
          </div>
      }
    </div>
  );
}

export default App;
