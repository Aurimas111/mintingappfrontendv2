import React, { Component } from 'react'

import twitter from 'C:/Users/aurim/OneDrive/Desktop/MintingAppFrontend/src/images/twitter.png';
import discord from 'C:/Users/aurim/OneDrive/Desktop/MintingAppFrontend/src/images/discord.png';

export default function Footer(){

        return (
            <div>
                <footer className = "footer">
                    {/*<span className="logos"></span>*/}
                    <a href="https://twitter.com/Drippy_Apes">
                    <img className='twitter' src = {twitter}/>
                    </a>
                    <a href="https:/discord.com">
                    <img className='discord' src = {discord}/>
                    </a>
                    {/*<ion-icon src="C:/Users/aurim/OneDrive/Desktop/MintingAppFrontend/src/images/twitter.png"></ion-icon>*/}
                </footer>
            </div>
        )
}

