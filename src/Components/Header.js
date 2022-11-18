import React, { useEffect } from 'react'
import logo from 'C:/Users/aurim/OneDrive/Desktop/MintingAppFrontend/src/images/Logo2.png';
import { ConnectWalletList, ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';

export default function Header(props) {
    //const [userStakeKey, setStakeKey] = React.useState()
    const wallet = useCardano()


    React.useEffect(() =>{
        props.setStakeKey(wallet.stakeAddress)
        props.setEnabledWallet(wallet.enabledWallet)
        //console.log(userStakeKey)
    },[useCardano()])

        return (
            <div className='header-div'>
                <header>
                    <img className='logo-3-4' src = {logo}/>
                    <div className='wallet-selection'>
                    <ConnectWalletButton
                    primaryColor='#005792'
                    onConnect={useCardano()}
                    customCSS={`
                    width: 200px;}
                    `}
                    />
                    </div>

                </header>
            </div>
        )
}