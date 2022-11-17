import React from 'react'
import Countdown from 'react-countdown';



export default function PaymentWindow(props){

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
        <span>You have </span>
        <Countdown date={Date.now() + props.timerTo}
        //renderer = {renderer}
        renderer= {props =>
          (
          <span>
            {props.formatted.minutes}:
            {props.formatted.seconds}
          </span>
        )}
        
        //zeroPadTime ={3} /*onChange={this.setTimes(props)}*/
        />
        <span> left to submit the transaction.</span>

      </div>
  </div>


      
        )
}