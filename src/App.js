import logo from './logo.svg';
import './App.css';
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import React, { useEffect } from 'react'
import SliderWindow from './Components/SliderWindow';
import ConnectWallet from './Components/ConnectWallet';


function App() {
  const [userStakeKey, setStakeKey] = React.useState()



  return (
    <div className="App">
      <Header setStakeKey={setStakeKey}></Header>
      {userStakeKey === null ? <ConnectWallet></ConnectWallet> : ""}
      {userStakeKey != null && userStakeKey === "stake1u96wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzds8kvgj7" ? <SliderWindow></SliderWindow> : <h1>connect your wallet</h1>}

      <Footer></Footer>
    </div>
  );
}

export default App;
