import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";

function SignupForm() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <div className="container--login-signup-forms container--signup-form">
            <div className='title-login-signup title-signup'>
                Sign Up
            </div>

            <h1 className='welcome-login-signup welcome-signup'>Welcome to Carebnb</h1>

            <form onSubmit={handleSubmit} className="form--login-signup form--signup">
                <ul className="list--errors">
                    {errors.map((error, idx) => <li key={idx} className="error-li">{error}</li>)}
                </ul>
                <div>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="First Name"
                        className="login-signup-field signup-field"
                        id="signup-field--first-name"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Last Name"
                        className="login-signup-field signup-field"
                        id="signup-field--last-name"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                        className="login-signup-field signup-field"
                        id="signup-field--email"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Username"
                        className="login-signup-field signup-field"
                        id="signup-field--username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="login-signup-field signup-field"
                        id="signup-field--password"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm Password"
                        className="login-signup-field signup-field"
                        id="signup-field--confirm-password"
                    />
                </div>
                <button type="submit" id='signup-submit-button' className='login-signup-submit-button'>Sign Up</button>
            </form>
        </div>
    );
}

export default SignupForm;