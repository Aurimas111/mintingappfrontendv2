import React, { Component} from 'react';

import TransactionService from '../services/TransactionService';
import { PulseLoader } from 'halogenium';



import {
  Address,
  ScriptHash,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionOutput,
  Value,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  LinearFee,
  BigNum,
  TransactionWitnessSet,
  Transaction,
  NetworkInfo,
  EnterpriseAddress,
  StakeCredential
} from "@emurgo/cardano-serialization-lib-asmjs"

let Buffer = require('buffer/').Buffer

class WalletInteracting extends Component {


  constructor(props){

    super(props)

    this.state = {
        timerTo: undefined,
        timerStart: new Date(),
        endOfReservationTime: new Date(),
        problemOccurred: false,
        isLoadingTx: false,
        isLoading: false,
        amountSubmitted: false,
        //txSubmitted: false,
        amountToSend: props.amountToSend,
        whichWalletSelected: props.enabledWallet,
        walletFound: false,
        walletIsEnabled: false,
        walletName: undefined,
        walletIcon: undefined,
        walletAPIVersion: undefined,
        wallets: props.enabledWallet,

        networkId: undefined,
        Utxos: undefined,
        CollatUtxos: undefined,
        balance: undefined,
        changeAddress: undefined,
        rewardAddress: undefined,
        usedAddress: undefined,

        txBody: undefined,
        txBodyCborHex_unsigned: "",
        txBodyCborHex_signed: "",
        submittedTxHash: "",

        addressBech32SendADA: "addr_test1qqtn7jyxf4rslnc7aepz4ydpc38n49h8f7zcy8uzdpqcemt5uvetzsu2sdz2fm58lhg8jlsujc0j2t6q84q54s7twymq47taxl",
        lovelaceToSend: 3000000,
        assetNameHex: "4c494645",
        assetPolicyIdHex: "ae02017105527c6c0c9840397a39cc5ca39fabe5b9998ba70fda5f2f",
        assetAmountToSend: 5,
        addressScriptBech32: "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8",
        datumStr: "12345678",
        plutusScriptCborHex: "4e4d01000033222220051200120011",
        transactionIdLocked: "",
        transactionIndxLocked: 0,
        lovelaceLocked: 3000000,
        manualFee: 900000,
    }
    
            /**
     * When the wallet is connect it returns the connector which is
     * written to this API variable and all the other operations
     * run using this API object
     */
             this.API = undefined;

             /**
              * Protocol parameters
              * @type {{
              * keyDeposit: string,
              * coinsPerUtxoWord: string,
              * minUtxo: string,
              * poolDeposit: string,
              * maxTxSize: number,
              * priceMem: number,
              * maxValSize: number,
              * linearFee: {minFeeB: string, minFeeA: string}, priceStep: number
              * }}
              */
             this.protocolParams = {
                 linearFee: {
                     minFeeA: "44",
                     minFeeB: "155381",
                 },
                 minUtxo: "34482",
                 poolDeposit: "500000000",
                 keyDeposit: "2000000",
                 maxValSize: 5000,
                 maxTxSize: 16384,
                 priceMem: 0.0577,
                 priceStep: 0.0000721,
                 coinsPerUtxoWord: "34482",
             }
     
             this.pollWallets = this.pollWallets.bind(this);

}
/**
     * Poll the wallets it can read from the browser.
     * Sometimes the html document loads before the browser initialized browser plugins (like Nami or Flint).
     * So we try to poll the wallets 3 times (with 1 second in between each try).
     *
     * Note: CCVault and Eternl are the same wallet, Eternl is a rebrand of CCVault
     * So both of these wallets as the Eternl injects itself twice to maintain
     * backward compatibility
     *
     * @param count The current try count.
     */
     pollWallets = (count = 0) => {
      const wallets = [];
      for(const key in window.cardano) {
            if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
              wallets.push(key);
          }
      }
      if (wallets.length === 0 && count < 3) {
          setTimeout(() => {
              this.pollWallets(count + 1);
          }, 1000);
          return;
      }
      this.setState({
          wallets,
          whichWalletSelected: wallets[0]
      }, () => {
          this.refreshData()
      });
  }
/**
* Handles the tab selection on the user form
* @param tabId
*/
handleTabId = (tabId) => this.setState({selectedTabId: tabId})

/**
   * Handles the radio buttons on the form that
   * let the user choose which wallet to work with
   * @param obj
   */
  handleWalletSelect = async (obj) => {
  const whichWalletSelected = this.props.enabledWallet
  /*setTimeout(() => {
    this.setState({isLoadingTx: true})
  }, 3000);*/
  setTimeout(() => {
    this.setState({isLoadingTx: true})
  }, 1);

  var diffMs = (this.state.endOfReservationTime - Date.now());

  setTimeout(() => {
    this.setState({timerTo: Math.floor(((diffMs % 86400000) % 3600000), console.log("timeris" + this.state.timerTo))})
  }, 2000);
  console.log(this.state.timerStart);
  console.log(this.state.endOfReservationTime);

  await this.setState({whichWalletSelected},
    () => {
          this.refreshData();
      })
}

/**
   * Generate address from the plutus contract cborhex
   */
 generateScriptAddress = () => {
  // cborhex of the alwayssucceeds.plutus
  // const cborhex = "4e4d01000033222220051200120011";
  // const cbor = Buffer.from(cborhex, "hex");
  // const blake2bhash = blake.blake2b(cbor, 0, 28);

  //const script = PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))
  // const blake2bhash = blake.blake2b(script.to_bytes(), 0, 28);
  const blake2bhash = "67f33146617a5e61936081db3b2117cbf59bd2123748f58ac9678656";
  const scripthash = ScriptHash.from_bytes(Buffer.from(blake2bhash,"hex"));

  const cred = StakeCredential.from_scripthash(scripthash);
  const networkId = NetworkInfo.testnet().network_id();
  const baseAddr = EnterpriseAddress.new(networkId, cred);
  const addr = baseAddr.to_address();
  const addrBech32 = addr.to_bech32();

  // hash of the address generated from script
  console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"))

  // hash of the address generated using cardano-cli
  const ScriptAddress = Address.from_bech32("addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8");
  console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"))


  console.log(ScriptAddress.to_bech32())
  console.log(addrBech32)

}

/**
* Handles the radio buttons on the form that
* let the user choose which wallet to work with
* @param obj

handleWalletSelect = (obj) => {
  const whichWalletSelected = obj.target.value
  this.setState({whichWalletSelected},
     () => {
           this.refreshData()
      })
  console.log(this.state.amountToSend);
  this.buildSendADATransaction(this.state.amountToSend);
}*/


  /**
   * Checks if the wallet is running in the browser
   * Does this for Nami, Eternl and Flint wallets
   * @returns {boolean}
   */

   checkIfWalletFound = () => {
    const walletKey = this.state.whichWalletSelected;
    const walletFound = !!window?.cardano?.[walletKey];
    this.setState({walletFound})
    return walletFound;
}

/**
 * Checks if a connection has been established with
 * the wallet
 * @returns {Promise<boolean>}
 */
checkIfWalletEnabled = async () => {
    let walletIsEnabled = false;

    try {
        const walletName = this.state.whichWalletSelected;
        walletIsEnabled = await window.cardano[walletName].isEnabled();
    } catch (err) {
        console.log(err)
    }
    this.setState({walletIsEnabled});

    return walletIsEnabled;
}

/**
 * Enables the wallet that was chosen by the user
 * When this executes the user should get a window pop-up
 * from the wallet asking to approve the connection
 * of this app to the wallet
 * @returns {Promise<boolean>}
 */

enableWallet = async () => {
    const walletKey = this.state.whichWalletSelected;

    try {
        this.API = await window.cardano[walletKey].enable();
    } catch(err) {
        console.log(err);
    }
    return this.checkIfWalletEnabled();
}

/**
 * Get the API version used by the wallets
 * writes the value to state
 * @returns {*}
 */
getAPIVersion = () => {
    const walletKey = this.state.whichWalletSelected;
    const walletAPIVersion = window?.cardano?.[walletKey].apiVersion;
    this.setState({walletAPIVersion})
    return walletAPIVersion;
}

/**
 * Get the name of the wallet (nami, eternl, flint)
 * and store the name in the state
 * @returns {*}
 */

getWalletName = () => {
    const walletKey = this.state.whichWalletSelected;
    const walletName = window?.cardano?.[walletKey].name;
    this.setState({walletName})
    return walletName;
}

/**
 * Gets the Network ID to which the wallet is connected
 * 0 = testnet
 * 1 = mainnet
 * Then writes either 0 or 1 to state
 * @returns {Promise<void>}
 */
getNetworkId = async () => {
    try {
        const networkId = await this.API.getNetworkId();
        this.setState({networkId})

    } catch (err) {
        console.log(err)
    }
}

/**
 * Gets the UTXOs from the user's wallet and then
 * stores in an object in the state
 * @returns {Promise<void>}
 */

getUtxos = async () => {

    let Utxos = [];

    try {
        const rawUtxos = await this.API.getUtxos();

        for (const rawUtxo of rawUtxos) {
            const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
            const input = utxo.input();
            const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
            const txindx = input.index();
            const output = utxo.output();
            const amount = output.amount().coin().to_str(); // ADA amount in lovelace
            const multiasset = output.amount().multiasset();
            let multiAssetStr = "";

            if (multiasset) {
                const keys = multiasset.keys() // policy Ids of thee multiasset
                const N = keys.len();
                // console.log(`${N} Multiassets in the UTXO`)


                for (let i = 0; i < N; i++){
                    const policyId = keys.get(i);
                    const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
                    // console.log(`policyId: ${policyIdHex}`)
                    const assets = multiasset.get(policyId)
                    const assetNames = assets.keys();
                    const K = assetNames.len()
                    // console.log(`${K} Assets in the Multiasset`)

                    for (let j = 0; j < K; j++) {
                        const assetName = assetNames.get(j);
                        const assetNameString = Buffer.from(assetName.name(),"utf8").toString();
                        const assetNameHex = Buffer.from(assetName.name(),"utf8").toString("hex")
                        const multiassetAmt = multiasset.get_asset(policyId, assetName)
                        multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
                        // console.log(assetNameString)
                        // console.log(`Asset Name: ${assetNameHex}`)
                    }
                }
            }


            const obj = {
                txid: txid,
                txindx: txindx,
                amount: amount,
                str: `${txid} #${txindx} = ${amount}`,
                multiAssetStr: multiAssetStr,
                TransactionUnspentOutput: utxo
            }
            Utxos.push(obj);
            // console.log(`utxo: ${str}`)
        }
        this.setState({Utxos})
    } catch (err) {
        console.log(err)
    }
}

/**
 * Gets the current balance of in Lovelace in the user's wallet
 * This doesnt resturn the amounts of all other Tokens
 * For other tokens you need to look into the full UTXO list
 * @returns {Promise<void>}
 */
getBalance = async () => {
    try {
        const balanceCBORHex = await this.API.getBalance();

        const balance = Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin().to_str();
        this.setState({balance})

    } catch (err) {
        console.log(err)
    }
}

/**
 * Get the address from the wallet into which any spare UTXO should be sent
 * as change when building transactions.
 * @returns {Promise<void>}
 */
getChangeAddress = async () => {
    try {
        const raw = await this.API.getChangeAddress();
        const changeAddress = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
        this.setState({changeAddress},
          function() {
            console.log("setState completed", this.state)
          }
          )
    } catch (err) {
        console.log(err)
    }

}

/**
 * This is the Staking address into which rewards from staking get paid into
 * @returns {Promise<void>}
 */
getRewardAddresses = async () => {

    try {
        const raw = await this.API.getRewardAddresses();
        const rawFirst = raw[0];
        const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        // console.log(rewardAddress)
        this.setState({rewardAddress})

    } catch (err) {
        console.log(err)
    }
}

/**
 * Gets previsouly used addresses
 * @returns {Promise<void>}
 */
getUsedAddresses = async () => {

    try {
        const raw = await this.API.getUsedAddresses();
        const rawFirst = raw[0];
        const usedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        // console.log(rewardAddress)
        this.setState({usedAddress})

    } catch (err) {
        console.log(err)
    }
}

/**
 * Refresh all the data from the user's wallet
 * @returns {Promise<void>}
 */
refreshData = async () => {
    //this.generateScriptAddress()

    try{
        const walletFound = this.checkIfWalletFound();
        if (walletFound) {
            await this.getAPIVersion();
            await this.getWalletName();
            const walletEnabled = await this.enableWallet();
            if (walletEnabled) {
                await this.getNetworkId();
                await this.getUtxos();
                //await this.getCollateral();
                await this.getBalance();
                await this.getChangeAddress();
                await this.getRewardAddresses();
                await this.getUsedAddresses();
                if(this.state.wallets.length>=1 && this.state.whichWalletSelected !== undefined) {
                  await this.buildSendADATransaction(this.state.amountToSend);
              }
            } else {
                await this.setState({
                    Utxos: null,
                    CollatUtxos: null,
                    balance: null,
                    changeAddress: null,
                    rewardAddress: null,
                    usedAddress: null,

                    txBody: null,
                    txBodyCborHex_unsigned: "",
                    txBodyCborHex_signed: "",
                    submittedTxHash: "",
                });
            }
        } else {
            await this.setState({
                walletIsEnabled: false,

                Utxos: null,
                CollatUtxos: null,
                balance: null,
                changeAddress: null,
                rewardAddress: null,
                usedAddress: null,

                txBody: null,
                txBodyCborHex_unsigned: "",
                txBodyCborHex_signed: "",
                submittedTxHash: "",
            });
        }
    } catch (err) {
      if(err.code === "-3"){
        let reservationEnd = new Date();
        const timerSta = new Date(this.state.timerStart);
        const currentTime = new Date(Date.now());
        reservationEnd.setMinutes (timerSta.getMinutes() + 15);
        setTimeout(() => {
          this.setState({endOfReservationTime: reservationEnd})
        }, 2000);

        var diffMs = (reservationEnd - currentTime);

        await setTimeout(() => {
          this.setState({timerTo: Math.round(((diffMs % 86400000) % 3600000), console.log("timeris 2  " + this.state.timerTo))})
        }, 2000);
        await this.setState({isLoadingTx: false});

        //TODO padaryti kad issaugotu timeri, ir jis neprasidetu vel nuo 15 min.
      }else{
        await this.setState({problemOccurred: true});
        await this.setState({isLoadingTx: false});
        /*setTimeout(() => {
          this.setState({problemOccurred: true})
        }, 2000);*/
        console.log(err)
      }
    }
}

/**
 * Every transaction starts with initializing the
 * TransactionBuilder and setting the protocol parameters
 * This is boilerplate
 * @returns {Promise<TransactionBuilder>}
 */
initTransactionBuilder = async () => {

    const txBuilder = TransactionBuilder.new(
        TransactionBuilderConfigBuilder.new()
            .fee_algo(LinearFee.new(BigNum.from_str(this.protocolParams.linearFee.minFeeA), BigNum.from_str(this.protocolParams.linearFee.minFeeB)))
            .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
            .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
            .coins_per_utxo_word(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
            .max_value_size(this.protocolParams.maxValSize)
            .max_tx_size(this.protocolParams.maxTxSize)
            .prefer_pure_change(true)
            .build()
    );

    return txBuilder
}

/**
 * Builds an object with all the UTXOs from the user's wallet
 * @returns {Promise<TransactionUnspentOutputs>}
 */
getTxUnspentOutputs = async () => {
    let txOutputs = TransactionUnspentOutputs.new()
    for (const utxo of this.state.Utxos) {
        txOutputs.add(utxo.TransactionUnspentOutput)
    }
    return txOutputs
}

/**
 * The transaction is build in 3 stages:
 * 1 - initialize the Transaction Builder
 * 2 - Add inputs and outputs
 * 3 - Calculate the fee and how much change needs to be given
 * 4 - Build the transaction body
 * 5 - Sign it (at this point the user will be prompted for
 * a password in his wallet)
 * 6 - Send the transaction
 * @returns {Promise<void>}
 */
//addr_test1qqtn7jyxf4rslnc7aepz4ydpc38n49h8f7zcy8uzdpqcemt5uvetzsu2sdz2fm58lhg8jlsujc0j2t6q84q54s7twymq47taxl
//const shelleyOutputAddress = Address.from_bech32(this.state.addressBech32SendADA);

buildSendADATransaction = async (amount) => {

  await this.setState({lovelaceToSend: amount});
  this.wait(1000);

  await this.setState({addressBech32SendADA: "addr_test1qzcqspg9mtd68htpq8kuw7f4tmered6h90ysc45rhpmmq5cz9lwq68zmd7at5mnl2mqmeuwtny2uplqcw7m58prcz5tqn4ztr6"});

  await this.getChangeAddress();


  const txBuilder = await this.initTransactionBuilder();
  this.wait(2000)


    const shelleyOutputAddress = Address.from_bech32(this.state.addressBech32SendADA);
    const shelleyChangeAddress = Address.from_bech32(this.state.changeAddress);

    await txBuilder.add_output(
        TransactionOutput.new(
            shelleyOutputAddress,
            Value.new(BigNum.from_str(this.state.lovelaceToSend.toString()))
        ),
    );


    // Find the available UTXOs in the wallet and
    // us them as Inputs
    const txUnspentOutputs = await this.getTxUnspentOutputs();

    await txBuilder.add_inputs_from(txUnspentOutputs, 0)

    console.log(txUnspentOutputs);

    // calculate the min fee required and send any change to an address
    await txBuilder.add_change_if_needed(shelleyChangeAddress)


    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = await txBuilder.build();
    console.log(txBody)


    // Tx witness
    const transactionWitnessSet = TransactionWitnessSet.new();

    const tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
    )
    this.wait(1000);
    let txVkeyWitnesses = await this.API.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);

    console.log(txVkeyWitnesses)

    txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());



    const signedTx = Transaction.new(
        tx.body(),
        transactionWitnessSet
    );


    const submittedTxHash = await this.API.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));
    //console.log(submittedTxHash)
    //this.setState({submittedTxHash});
    this.props.setSubmittedTxHash(submittedTxHash)
    if(this.submittedTxHash !== ""){
      TransactionService.txSubmitted(this.state.amountToSend);
      this.props.setTxSubmitted(true)
      //this.setState({txSubmitted: true});
    }


}

      wait(ms){
        var start = new Date().getTime();
        var end = start;
        while(end < start + ms) {
          end = new Date().getTime();
       }
     }

      setTimes(props){
        this.setState({timerMinutes: props.formatted.minutes})
        this.setState({timerSeconds: props.formatted.seconds})     

      }


    render() {
      let wallets;

  wallets= 
  <div className="container">
  {this.state.isLoadingTx ? (<><div className='loader-for-tx'>
        <PulseLoader color="#fff" size="16px" margin="4px" /></div>
        <div className='loading-info'>
        <span>Preparing your transaction...</span>
        </div>
        </>
            ) : (
  <div className='reserved' style={{marginBottom: "130px"}}>
                <div className='wallets' style={{paddingTop: "30px"}}>
          <button className="wallet-button" onClick={this.handleWalletSelect}><img src={window.cardano[this.state.wallets].icon} width={60} height={60} alt={this.state.wallets}></img></button>

      </div>
            </div>)}
            </div>

        return (
            <div>
            {wallets}
            </div>
                
        );
    }
}

export default WalletInteracting;