import React from 'react'
import Countdown from 'react-countdown';
import WalletInteracting from './WalletInteracting';


export default function PaymentWindow(props){


  function render(propss){
    if(!propss.completed){
      return (<><span>You have {propss.formatted.minutes}:{propss.formatted.seconds} left to submit the transaction.</span><WalletInteracting
        enabledWallet={props.enabledWallet}
        amountToSend={props.amountToSend}
        setTxSubmitted={props.setTxSubmitted}
        setSubmittedTxHash={props.setSubmittedTxHash}
      ></WalletInteracting></>
      )
    }else{
      return (<><span> Time to submit your transaction has expired.</span> <br></br><span> If you submitted your transaction before it expired, you will receive your NFTS.</span></>
      )
    }
  }

        return (

        <div className='payment' style={{marginTop: "80px", marginBottom: "130px"}}>
      <div className='information-reserved-1'>
      {props.amountReserved > 1 &&
  <h2 className='white-text'>You have requested to mint {props.amountReserved} Drippy apes for {props.amountToSend} ADA</h2>
}
{props.amountReserved === 1 &&
    <h2 className='white-text'>You have requested to mint {props.amountReserved} Drippy ape for {props.amountToSend} ADA</h2>
}
      </div>
      <div className='information-reserved-2'>
        

        <><Countdown date={Date.now() + props.timerTo}
                  renderer={render}
                  precision={2}
                  />
        </>
      </div>
  </div>
        )
}
