import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {

  }

  return (
      <div className="mainContainer">

        <div className="dataContainer">
          <div className="header">
            👋 Hey there!
          </div>

          <div className="bio">
            I am thanasisxan and I work as fullstack dev and I am trying to learn more about blockchain development! Connect your Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </div>
      </div>
  );
}