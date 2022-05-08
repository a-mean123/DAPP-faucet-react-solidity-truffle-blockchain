
import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
function App() {


  const [ web3Api , setweb3Api] = useState({ provider: null , web3: null , contract: null })
  const [ account , setAccount ] = useState(null);
  const [ accountBalance, setAccountBalance ] = useState(null);
  const [ appBalance , setAppBalance ] = useState(null);


  const providerListener = (provider)=>{

    provider.on('accountsChanged' , ()=>{
      window.location.reload();
    })

    provider.on('chainChanged' , ()=>{
      window.location.reload();
    })


  }



  useEffect(()=>{

   const loadProvider = async ()=>{

    const provider = await detectEthereumProvider();

    if(provider){
      providerListener(provider);
      const contract = await loadContract("Faucet" , provider)

      const web3  = new Web3(provider);
      setweb3Api({
        provider: provider,
        web3: web3,
        contract: contract
      })
      console.log(web3Api);
    }

   }

   loadProvider();

  }, []);


  useEffect(()=>{

    const loadAccount = async ()=>{
      let accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(account);
    }
    web3Api.web3 && loadAccount()

  }, [ web3Api.web3 ])


  useEffect(()=>{
    const loadBalance = async ()=>{
      const { web3 , contract } = web3Api;
      let balance = await web3.eth.getBalance(contract.address);
      setAppBalance( web3.utils.fromWei(balance, 'ether') );

    }

    web3Api.contract && loadBalance();

  } , [ web3Api.contract ])



  useEffect(()=>{
    const loadBalance = async ()=>{

       let balance = await web3Api.web3.eth.getBalance(account);
       balance = web3Api.web3.utils.fromWei(balance , 'ether'); 
       setAccountBalance(balance); 

    }

    account && loadBalance();


  } , [ web3Api.web3 ,account  ])


  const donate =async ()=>{

    const { web3 , contract  } = web3Api;
    
    await contract.addFunds( { from: account , value: web3.utils.toWei('1' , 'ether') } );
    window.location.reload();
  }


  const withdraw = async ()=>{

    const { web3 , contract } = web3Api;
    const amount = web3.utils.toWei("0.1" , 'ether');
    await contract.withDrawFunds( amount, { from: account });
    window.location.reload();

  }

  return (
    <div className='container'>

      <div className='row mt-5'>

          <div className='col-6 mx-auto mt-5'>

              {
                account ? 
                <div className='account-info card p-3'>

                  <h5>Account : { account } </h5>
                  <h6 className='' >My Balance : { accountBalance } eth</h6>
                </div>
                : !web3Api.provider ?
                <div className='alert bg-warning'>
                  you don't have any wallet , please install metamask
                </div>
                :  <div className='account-info card p-3'>

                      <h5>Account :  <button className='btn btn-outline-warning'  onClick={ ()=> web3Api.provider.request({ method: 'eth_requestAccounts' })  }  > Connect Wallet ! </button>   </h5>
                     
                  </div>

              }

              {
                web3Api.contract ?
                <div className='app-info card p-3 mt-2'>
                    <h6 className='' >Application budget : { appBalance } eth</h6>
                </div>
                :
                <div> Looking for web3 ... </div>
              }

              <div className='actions mt-3 text-center'>
                  <button disabled={ !(account && web3Api.contract) } className='btn btn-primary' onClick={()=>donate()} >Donate 1 eth</button>
                  <button disabled={ !(account && web3Api.contract) } className=' btn btn-success' onClick={ ()=>withdraw() }>Withdraw 0.1 eth</button>

              </div>


          </div>

      </div>

    </div>
  );
}

export default App;
