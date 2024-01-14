import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {useEffect, useState} from 'react';
import ListOfTodo from './components/ListOfTodo';
import Hotels from "./components/Hotels";
//import GetAllUsers from "./components/GetAllUsers";
const db = firebase.firestore();
function App() {
    const [auth, setAuth] = useState(
        window.localStorage.getItem('auth') === 'true'
    );
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userCred) => {
            if (userCred) {
                //console.log(userCred);
                setAuth(true);
                window.localStorage.setItem('auth', 'true');
                userCred.getIdToken().then((token) => {
                    console.log(token)
                    setToken(token);
                });

            }
        });
    }, []);


    const loginWithGoogle = () => {
        firebase
            .auth()
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((userCred) => {
                if (userCred) {
                    setAuth(true);
                    window.localStorage.setItem('auth', 'true');
                }
            });
    };
    const logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setAuth(false);
                window.localStorage.setItem('auth', 'false');
            });
    }
    const signUpWithEmailAndPassword = async (email, password, firstName, lastName, phoneNumber) => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            //console.log(user)
            // Update additional user information in Firestore
            const userDocRef = db.collection('user').doc(user.uid);
            console.log(firebase.firestore().collection('user').doc(user.uid))
            await userDocRef.set({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                role: 'user',
                _id: user.uid,
            });

            await user.updateProfile({
                displayName: `${firstName} ${lastName}`,
            });

        } catch (error) {
            console.error('Error signing up:', error.message);
            setError(error.message);
        }
    };
    const signInWithEmailAndPassword = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError(error.message);
        }
    }
    const handleSignUp = (e) => {
        e.preventDefault();
        setError(null); // Reset any previous errors
        signUpWithEmailAndPassword(email, password, firstName, lastName, phoneNumber).then(r => {
            console.log(r)
        });
    };
    const handleSignIn = (e) => {
        e.preventDefault();
        setError(null); // Reset any previous errors
        signInWithEmailAndPassword(email, password);
    };
    return (
        <div className="App">

            {auth ? (<div>
                    <ListOfTodo token={token}/>
                    <button onClick={logout}>Logout</button>
                </div>


            ) : (<div>
                    <button onClick={loginWithGoogle}>Login with Google</button>
                    <div className='signup'>
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSignUp}>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <button type="submit">Sign Up</button>
                        </form>
                        {error && <p>{error}</p>}
                    </div>
                    <div className="signin">


                         <form onSubmit={handleSignIn}>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit">Sign In</button>
                        </form>


                    </div>
                </div>
            )}
            {/*<GetAllUsers/>*/}
            <Hotels/>

        </div>
    );
}

export default App;

