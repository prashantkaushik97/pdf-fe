import React, { useState } from 'react';
import './style.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/userSlice';
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setname] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const addUserDocument = async (user) => {
        try {
            await setDoc(doc(db, 'users', email), {
                email: email,
                name: name,
            });
            console.log('Document written with ID: ', email);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };
    const onSignUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password, )
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/");
                console.log(user);
            }).then(() => {addUserDocument()}

            )
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                navigate("/");
                const userDoc = await getDoc(doc(db, "users", user.email));
                console.log(user)
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const { email, name } = userData;
                    dispatch(setUser({ email, name }));
                } else {
                    // If user data doesn't exist, dispatch with only email
                    dispatch(setUser({ email }));
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isLogin) {
            onLogin(event);
        } else {
            onSignUp(event);
        }
    };

    return (
        <div className="auth-form">
            <h2>{isLogin ? 'Login' : 'Signup'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {!isLogin && <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="name" id="name" value={name} onChange={(e) => setname(e.target.value)} required />
                </div>}
                <button style={{ 'marginBottom': "10px" }} type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                <button type="button" onClick={toggleForm}>
                    {isLogin ? 'Need to create an account?' : 'Already have an account?'}
                </button>
            </form>
        </div>
    );
};

export default Login;
