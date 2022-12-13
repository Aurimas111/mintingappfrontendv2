import React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import AmountService from '../services/AmountService';

export default function SliderWindow(props) {
    const [sliderValue, setSliderValue] = React.useState(1);

// kai yra uzrezervuotas paskutinis nft ir parefreshinamas puslapis, nieko nekrauna nes isSoldOut yra true
    React.useEffect(()=>{
      AmountService.getSoldOutProgress().then(res =>{
        props.setIsSoldOut(res.data);
      })
    },[])

    const changeValue = (event, value) => {
      setSliderValue(parseInt(event.target.value));
    };

    function sendOrder(amount){
      AmountService.sendOrder(amount, props.userStakeKey).then(res =>{
        if(res.data['amountToSend'] === 0){
          props.setIsSoldOut(true)

        }else{
        props.setAmountToSend(res.data['amountToSend']);
        }
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