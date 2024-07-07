import React from 'react';
import '../css/review.css';

const ForgotPassword=()=>{
    return (
        <div className="container mt-4 passwordbox" id='box1'>
            <center><h2 id="heading">Change your Password</h2></center>
            <hr /><br />
            <form>
                <label htmlFor="password">Enter New Password:</label>
                <input type="password" id="password" name="password" required /><br />

                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required /><br /><br />

                <center><button id='submit' type="submit">Submit</button></center>
            </form>
        </div>
    );
}

export default ForgotPassword;