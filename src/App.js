import logo from './logo.svg';
import './App.css';
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import React, { useEffect } from 'react'


function App() {
  const [userStakeKey, setStakeKey] = React.useState()

  return (
    <div className="App">
      <Header setStakeKey={setStakeKey}></Header>
      {userStakeKey != null ? <h1>{userStakeKey}</h1> : <h1>connect your wallet</h1>}
      <Footer></Footer>
    </div>
  );
}

export default App;
