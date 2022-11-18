import React, { Component } from 'react'


export default function TxSubmittedWindow(props){

        return (
            <div>
                <div className='payment' style={{marginTop: "80px", marginBottom: "130px"}}>
                <div className='information-submitted'>
                <span> Transaction succesfully submitted!</span> 
                <br></br>
                <span>Transaction hash: {props.submittedTxHash} </span>
                <br></br>
                </div>

                <div className='information-submitted-2'>
                <span> Waiting for your transaction to go through...</span> 
                </div>

                </div>

            </div>
        )
}

