import './App.css';
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import React, { useEffect } from 'react'
import SliderWindow from './Components/SliderWindow';
import ConnectWallet from './Components/ConnectWallet';
import PaymentWindow from './Components/PaymentWindow';
import NotWhitelisted from './Components/NotWhitelisted';
import { PulseLoader } from 'halogenium';
import TxSubmittedWindow from './Components/TxSubmittedWindow';


function App() {
  const [userStakeKey, setStakeKey] = React.useState()
  const [amountToSend, setAmountToSend] = React.useState(0)
  const [amountReserved, setAmountReserved] = React.useState(0)
  const [endOfReservationTime, setEndOfReservationTime] = React.useState(new Date())
  const [timerTo, setTimerTo] = React.useState(undefined)
  const [timerStart, setTimerStart] = React.useState(new Date())
  const [isLoadingAmountToSend, setIsLoadingAmountToSend] = React.useState(false)
  const [enabledWallet, setEnabledWallet ] = React.useState(undefined)
  const [txSubmitted, setTxSubmitted] = React.useState(false)
  const [submittedTxHash, setSubmittedTxHash] = React.useState(undefined)


  return (
    <div className="App">
      <Header setStakeKey={setStakeKey} setEnabledWallet={setEnabledWallet}></Header>

      {userStakeKey === null && amountToSend === 0 ? <ConnectWallet></ConnectWallet> : ""}
      
      {amountToSend === 0 && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? <SliderWindow setAmountToSend = {setAmountToSend}
      setAmountReserved = {setAmountReserved}
      setEndOfReservationTime = {setEndOfReservationTime}
      setTimerTo = {setTimerTo}
      timerStart = {timerStart}
      //isLoadingAmountToSend= {isLoadingAmountToSend}
      setIsLoadingAmountToSend = {setIsLoadingAmountToSend}
      ></SliderWindow> : ""}

      {amountToSend != 0 && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? "" : <NotWhitelisted></NotWhitelisted>}

      {isLoadingAmountToSend && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? (<div className='loader'>
            <PulseLoader color="#fff" size="16px" margin="4px" /></div>
      ) : ("")}

      {amountToSend !== 0 && !isLoadingAmountToSend && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" && !txSubmitted ? <PaymentWindow
      amountToSend= {amountToSend}
      endOfReservationTime={endOfReservationTime}
      timerTo={timerTo}
      timerStart={timerStart}
      amountReserved={amountReserved}
      enabledWallet={enabledWallet}
      setTxSubmitted={setTxSubmitted}
      setSubmittedTxHash={setSubmittedTxHash}
      ></PaymentWindow> : ""}

      {txSubmitted && amountToSend !== 0 && !isLoadingAmountToSend && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? <TxSubmittedWindow
      submittedTxHash={submittedTxHash}
      ></TxSubmittedWindow> : ""}


      <Footer></Footer>
    </div>
  );
}

export default App;
