import React from 'react'
import logo from 'C:/Users/aurim/OneDrive/Desktop/MintingAppFrontend/src/images/Logo2.png';
import { ConnectWalletList, ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';
import AmountService from '../services/AmountService';

export default function Header(props) {
    //const [userStakeKey, setStakeKey] = React.useState()
    const [clicked,setClicked] = React.useState(false)
    const wallet = useCardano()


    React.useEffect(() =>{
        props.setStakeKey(wallet.stakeAddress)
        props.setEnabledWallet(wallet.enabledWallet)
        if(wallet.stakeAddress!== null){
            AmountService.getActiveOrder(wallet.stakeAddress).then(res =>{
                if(res.data['amountToSend'] !== 0){
                props.setAmountReserved(res.data['amountReserved'])
                props.setAmountToSend(res.data['amountToSend'])
                let d = new Date(res.data['endOfReservationTime'])
    
                const currentTime = new Date(Date.now());
                var diffMs = (d - currentTime);
                props.setTimerTo(Math.floor(((diffMs % 86400000) % 3600000)))
                }
        
              });
        }
    }, [wallet.stakeAddress])



        return (
            <div className='header-div'>
                <header>
                    <img className='logo-3-4' src = {logo}/>
                    <div className='wallet-selection'>
                    <ConnectWalletButton
                    primaryColor='#005792'
                    limitNetwork="testnet"
                    customCSS={`
                    width: 200px;}
                    `}
                    />
                    </div>

                </header>
            </div>
        )
}