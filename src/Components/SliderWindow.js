import React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import AmountService from '../services/AmountService';

export default function SliderWindow(props) {
    const [sliderValue, setSliderValue] = React.useState(1);


    const changeValue = (event, value) => {
      setSliderValue(parseInt(event.target.value));
    };

    function saveAmount(amount){
      AmountService.createAmount(amount).then(res =>{
        props.setAmountToSend(res.data['amountToSend']);
      });

    }
      
    function handleNextButton(amount){

      props.setIsLoadingAmountToSend(true)

      if(amount>=1 && amount <=5){
      saveAmount(amount);
      props.setAmountReserved(amount)

      let reservationEnd = new Date();
      const timerSta = new Date(props.timerStart);
      const currentTime = new Date(Date.now());
      reservationEnd.setMinutes (timerSta.getMinutes() + 1);

      props.setEndOfReservationTime(reservationEnd)

      var diffMs = (reservationEnd - currentTime);

      props.setTimerTo(Math.round(((diffMs % 86400000) % 3600000)))

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
                    //getAriaValueText={getText}
                    step={1}
                    //marks={marks}
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