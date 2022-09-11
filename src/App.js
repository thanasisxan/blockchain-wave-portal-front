import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';

export default function App() {

  const checkIfWalletIsConnected = () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
            👋 Hey there!
          </div>

          <div className="bio">
            I am thanasisxan and I work as fullstack dev and I am trying to learn more about blockchain development! Connect your Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={null}>
            Wave at Me
          </button>
        </div>
      </div>
  );
}