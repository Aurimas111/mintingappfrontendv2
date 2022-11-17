import React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


export default function SliderWindow() {
    const [sliderValue, setSliderValue] = React.useState(1);


     const changeValue = (event, value) => {
        setSliderValue(parseInt(event.target.value));
      };

    return (

        <div className="slider-container">
          <div className='slideris' style={{ marginTop: "130px", marginBottom: "130px" }}>
              <div className='frame-1'>
                <div className='rectangle-2'>
                  <div className='supported-wallets'>
                    <span className='inter-bold-white-20px'>Currently only Nami and Eternl wallets are supported!</span>
                  </div>
                  <div className='information-1'>
                    <span>Cost is 80 ADA per NFT.</span>
                  </div>
                  <div className='information-2'>
                    <span>Please select the amount of NFTs you would like to mint using the slider below.</span>
                  </div>
                </div>
                <Box sx={{ width: 500 }} className="slider-itself" style={{ marginTop: "300px" }}>
                  <Slider
                    aria-label="Always visible"
                    defaultValue={1}
                    //getAriaValueText={getText}
                    step={1}
                    //marks={marks}
                    min={1}
                    max={5}
                    valueLabelDisplay="on"
                    color="primary"
                    value={sliderValue}
                    onChange={changeValue}
                    />

                </Box>
                <button className="btn btn-success" onClick={() => this.handleNextButton(this.state.value)}>Next</button>
                {sliderValue}

              </div>
            </div>
            </div>
            

    )
}