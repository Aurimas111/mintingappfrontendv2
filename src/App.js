import './App.css';
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import React from 'react'
import SliderWindow from './Components/SliderWindow';
import ConnectWallet from './Components/ConnectWallet';
import PaymentWindow from './Components/PaymentWindow';
import NotWhitelisted from './Components/NotWhitelisted';
import { PulseLoader } from 'halogenium';
import TxSubmittedWindow from './Components/TxSubmittedWindow';
import SoldOutWindow from './Components/SoldOutWindow'
import AmountService from './services/AmountService';


function App() {
  const [userStakeKey, setStakeKey] = React.useState()
  const [amountToSend, setAmountToSend] = React.useState(0)
  const [amountReserved, setAmountReserved] = React.useState(0)
  //const [endOfReservationTime, setEndOfReservationTime] = React.useState(0)
  const [timerTo, setTimerTo] = React.useState(undefined)
  const [timerStart, setTimerStart] = React.useState(new Date())
  const [isLoadingAmountToSend, setIsLoadingAmountToSend] = React.useState(false)
  const [enabledWallet, setEnabledWallet ] = React.useState(undefined)
  const [txSubmitted, setTxSubmitted] = React.useState(false)
  const [submittedTxHash, setSubmittedTxHash] = React.useState(undefined)
  const [isSoldOut, setIsSoldOut] = React.useState(true)



  React.useEffect(() =>{
    AmountService.getSoldOutProgress().then(res =>{
      setIsSoldOut(res.data);
    })
  }, [])


  // Kai atlieka rezervacija visa svarbia informacija issaugoti i db
  // jei vartotojas pekrauna puslapi su walletu kuris jau buvo padejes uzsakyma ir uzsakymas dar nera apmoketas
  // uzkrauti ta uzsakyma

  return (
    <div className="App">
      <Header setStakeKey={setStakeKey}
      setEnabledWallet={setEnabledWallet}
      userStakeKey={userStakeKey}
      setAmountToSend={setAmountToSend}
      setAmountReserved={setAmountReserved}
      setTimerTo={setTimerTo}
      ></Header>

      {isSoldOut && amountReserved === 0 ? <SoldOutWindow></SoldOutWindow> : ""}
      {userStakeKey === null && !isSoldOut ? <ConnectWallet></ConnectWallet> : ""}
      
      {amountToSend === 0 && !isSoldOut && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? <SliderWindow setAmountToSend = {setAmountToSend}
      userStakeKey = {userStakeKey}
      setAmountReserved = {setAmountReserved}
      //setEndOfReservationTime = {setEndOfReservationTime}
      setTimerTo = {setTimerTo}
      timerStart = {timerStart}
      //isLoadingAmountToSend= {isLoadingAmountToSend}
      setIsLoadingAmountToSend = {setIsLoadingAmountToSend}
      //endOfReservationTime={endOfReservationTime}
      ></SliderWindow> : ""}

      {amountToSend === 0 && !isSoldOut && userStakeKey !== "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? <NotWhitelisted></NotWhitelisted> : ""}

      {isLoadingAmountToSend && !isSoldOut && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? (<div className='loader'>
            <PulseLoader color="#fff" size="16px" margin="4px" /></div>
      ) : ("")}

      {amountToSend !== 0 && !isSoldOut && !isLoadingAmountToSend && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" && !txSubmitted ? <PaymentWindow
      amountToSend= {amountToSend}
      //endOfReservationTime={endOfReservationTime}
      timerTo={timerTo}
      timerStart={timerStart}
      amountReserved={amountReserved}
      enabledWallet={enabledWallet}
      setTxSubmitted={setTxSubmitted}
      setSubmittedTxHash={setSubmittedTxHash}
      ></PaymentWindow> : ""}

      {txSubmitted && !isSoldOut && amountToSend !== 0 && !isLoadingAmountToSend && userStakeKey === "stake_test1up6wxv43gw9gx39ya6rlm5re0cwfv8e99aqr6s22c09hzdsqux2kr" ? <TxSubmittedWindow
      submittedTxHash={submittedTxHash}
      ></TxSubmittedWindow> : ""}


      <Footer></Footer>
    </div>
  );
}

export default App;
