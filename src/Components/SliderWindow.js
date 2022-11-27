import React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import AmountService from '../services/AmountService';

export default function SliderWindow(props) {
    const [sliderValue, setSliderValue] = React.useState(1);
    const [endOfReservationTime, setEndOfReservationTime] = React.useState(new Date())


    React.useEffect(()=>{
      AmountService.getActiveOrder(props.userStakeKey).then(res =>{
        if(res.data['amountToSend'] !== 0){
        props.setAmountReserved(res.data['amountReserved'])
        props.setAmountToSend(res.data['amountToSend'])
        //props.setTimerTo(res.data['endOfReservationTime'])
        let d = new Date(res.data['endOfReservationTime'])
        //setEndOfReservationTime(setDate)
        //endOfReservationTime.setDate(res.data['endOfReservationTime'])

        const currentTime = new Date(Date.now());
        //console.log(endOfReservationTime)
        var diffMs = (d - currentTime);
        props.setTimerTo(Math.floor(((diffMs % 86400000) % 3600000)))
        }

      });
    },[])


    const changeValue = (event, value) => {
      setSliderValue(parseInt(event.target.value));
    };

    function sendOrder(amount){
      AmountService.sendOrder(amount, props.userStakeKey).then(res =>{
        props.setAmountToSend(res.data['amountToSend']);
      });

    }
      
    function handleNextButton(amount){

      props.setIsLoadingAmountToSend(true)

      if(amount>=1 && amount <=5){
      sendOrder(amount);
      props.setAmountReserved(amount)

      let reservationEnd = new Date();
      const timerSta = new Date(props.timerStart);
      const currentTime = new Date(Date.now());
      reservationEnd.setMinutes (timerSta.getMinutes() + 15);

      setEndOfReservationTime(reservationEnd)

      var diffMs = (reservationEnd - currentTime);


      setTimeout(() => {
        props.setTimerTo(Math.floor(((diffMs % 86400000) % 3600000)))
      }, 2000);

      setTimeout(() =>{
        props.setIsLoadingAmountToSend(false)
      }, 2000)

      }
    }

    return (


        <div className="container">
          <div className='slideris' style={{ marginTop: "102px", marginBottom: "130px" }}>
                  <div className='information-1'>
                    <span>Cost is 80 ADA per NFT.</span>
                  </div>
                  <div className='information-2'>
                    <span>Please select the amount of NFTs you would like to mint using the slider below.</span>
                  </div>

                <Box sx={{ width: 500 }} className="slider-itself">
                  <Slider
                    aria-label="Always visible"
                    defaultValue={1}
                    step={1}
                    min={1}
                    max={5}
                    valueLabelDisplay="on"
                    color="secondary"
                    value={sliderValue}
                    onChange={changeValue}
                    />
                    <div className="cost">
                    You will have to send {sliderValue*80} ADA
                    </div>

                </Box>
                <button className="btn btn-success" onClick={() => handleNextButton(sliderValue)}>Next</button>
            </div>
            </div>
            

    )
}