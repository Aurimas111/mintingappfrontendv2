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
  const [isSoldOut, setIsSoldOut] = React.useState(false)
  const [isWhitelisted, setIsWhitelisted] = React.useState(false)




// is pradziu padarius rezervacija, kartais neteisingai rodo laika (keliom minutes atsilieka timeris)


  React.useEffect(() =>{
    if(userStakeKey !== undefined && userStakeKey !== null){
    AmountService.getActiveOrder(userStakeKey).then(res =>{
      setIsWhitelisted(res.data['whitelisted'])


      if(res.data['amountToSend'] !== 0){
      if(res.data['txSubmitted']===true){
        setAmountToSend(0)
      }else{
      setAmountReserved(res.data['amountReserved'])
      setAmountToSend(res.data['amountToSend'])
      let d = new Date(res.data['endOfReservationTime'])

      const currentTime = new Date(Date.now());
      var diffMs = (d - currentTime);
      setTimerTo(Math.floor(((diffMs % 86400000) % 3600000)))
      }
      }else{
          AmountService.getSoldOutProgress().then(res =>{
            setIsSoldOut(res.data);
          })
      }
    });
  }

  }, [userStakeKey])


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

      {isSoldOut && amountToSend === 0 ? <SoldOutWindow></SoldOutWindow> : ""}
      {userStakeKey === null ? <ConnectWallet></ConnectWallet> : ""}
      
      {amountToSend === 0 && !isSoldOut && isWhitelisted ? <SliderWindow
      setAmountToSend = {setAmountToSend}
      userStakeKey = {userStakeKey}
      setAmountReserved = {setAmountReserved}
      //setEndOfReservationTime = {setEndOfReservationTime}
      setTimerTo = {setTimerTo}
      timerStart = {timerStart}
      //isLoadingAmountToSend= {isLoadingAmountToSend}
      setIsLoadingAmountToSend = {setIsLoadingAmountToSend}
      setIsSoldOut = {setIsSoldOut}
      isSoldOut = {isSoldOut}
      //endOfReservationTime={endOfReservationTime}
      ></SliderWindow> : ""}

      {amountToSend === 0 && !isSoldOut && !isWhitelisted ? <NotWhitelisted></NotWhitelisted> : ""}

      {isLoadingAmountToSend && !isSoldOut && isWhitelisted ? (<div className='loader'>
            <PulseLoader color="#fff" size="16px" margin="4px" /></div>
      ) : ("")}

      {amountToSend !== 0 && !isSoldOut && !isLoadingAmountToSend && isWhitelisted && !txSubmitted ? <PaymentWindow
      amountToSend= {amountToSend}
      //endOfReservationTime={endOfReservationTime}
      timerTo={timerTo}
      timerStart={timerStart}
      amountReserved={amountReserved}
      enabledWallet={enabledWallet}
      setTxSubmitted={setTxSubmitted}
      setSubmittedTxHash={setSubmittedTxHash}
      ></PaymentWindow> : ""}

      {txSubmitted && !isSoldOut && amountToSend !== 0 && !isLoadingAmountToSend && isWhitelisted ? <TxSubmittedWindow
      submittedTxHash={submittedTxHash}
      ></TxSubmittedWindow> : ""}


      <Footer></Footer>
    </div>
  );
}

export default App;
