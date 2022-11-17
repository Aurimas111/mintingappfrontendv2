import logo from './logo.svg';
import './App.css';
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import React, { useEffect } from 'react'
import SliderWindow from './Components/SliderWindow';
import ConnectWallet from './Components/ConnectWallet';
import PaymentWindow from './Components/PaymentWindow';
import NotWhitelisted from './Components/NotWhitelisted';
import { PulseLoader } from 'halogenium';


function App() {
  const [userStakeKey, setStakeKey] = React.useState()
  const [amountToSend, setAmountToSend] = React.useState(0)
  const [amountReserved, setAmountReserved] = React.useState(0)
  const [endOfReservationTime, setEndOfReservationTime] = React.useState(new Date())
  const [timerTo, setTimerTo] = React.useState(undefined)
  const [timerStart, setTimerStart] = React.useState(new Date())
  const [isLoadingAmountToSend, setIsLoadingAmountToSend] = React.useState(false)


  return (
    <div className="App">
      <Header setStakeKey={setStakeKey}></Header>

      {userStakeKey === null && amountToSend === 0 ? <ConnectWallet></ConnectWallet> : ""}
      
      {userStakeKey != null && amountToSend === 0 && userStakeKey === "stake1u96wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzds8kvgj7" ? <SliderWindow setAmountToSend = {setAmountToSend}
      setAmountReserved = {setAmountReserved}
      setEndOfReservationTime = {setEndOfReservationTime}
      setTimerTo = {setTimerTo}
      timerStart = {timerStart}
      //isLoadingAmountToSend= {isLoadingAmountToSend}
      setIsLoadingAmountToSend = {setIsLoadingAmountToSend}
      ></SliderWindow> : <NotWhitelisted></NotWhitelisted>}

      {isLoadingAmountToSend ? (<div className='loader'>
            <PulseLoader color="#fff" size="16px" margin="4px" /></div>
      ) : ("")}

      {amountToSend != 0 && !isLoadingAmountToSend ? <PaymentWindow
      amountToSend= {amountToSend}
      endOfReservationTime={endOfReservationTime}
      timerTo={timerTo}
      timerStart={timerStart}
      amountReserved={amountReserved}

      ></PaymentWindow> : ""}
      <Footer></Footer>
    </div>
  );
}

export default App;
