import React, { useState } from "react";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";

const Authentication = () => {

  const [isSignIn, setIsSignIn] = useState(
    localStorage.getItem("authPage") !== "signup"
  );


  const switchToSignUp = () => {
    localStorage.setItem("authPage", "signup");
    setIsSignIn(false);
  };


  const switchToSignIn = () => {
    localStorage.setItem("authPage", "signin");
    setIsSignIn(true);
  };


  return (
    <>
      {isSignIn ? (
        <SignIn onSwitch={switchToSignUp} />
      ) : (
        <SignUp onSwitch={switchToSignIn} />
      )}
    </>
  );
};

export default Authentication;