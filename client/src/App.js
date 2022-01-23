import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { useState } from 'react';

//on ropsten:
const nftAddress = "0xb32Fe1E891d6B79c4928c749bA8C0e8DF07481fa";

function App() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  // for transfer operation
  const[to,setTo]=useState('');
  const[ens,setEnsTo]=useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftAddress, NFT.abi, provider)

  async function getName() {
    setName(await contract.name());
  }

  async function getSymbol() {
    setSymbol(await contract.symbol());
  }

  async function setEns(event) {
    setEnsTo(event.target.value);
  }
  async function setAddress(event) {
    setTo(event.target.value)
  }

  async function transferNft() {
    let pass =false;
    //if ens exists, resolves it
    if(ens!=='' && pass == false){
      await provider.resolveName(ens)
      .then(data=>{
        setTo(data)
        pass=true
        console.log(data);
      })

    }
    //if no ens, check balance
    else if (ens == '' && pass == false){
      provider.getBalance(to).then((balance) => {
       const balanceInEth = ethers.utils.formatEther(balance)
       console.log(balanceInEth);
       pass=true;
      })
    }
    //gets the authorized address
    let auth = await contract.connect(signer).authorized();
    if(pass==true){
      //if conditions pass, mints and transfers nft.
      await contract.connect(signer).createToken("https://cdna.artstation.com/p/assets/images/images/005/693/850/original/holly-turner-hermionetransparent.gif?1493066989")
      let tokenId = await contract.connect(signer)._tokenIds();
      await contract.connect(signer).transferFrom(auth,to,tokenId)
      .then(data=>{
        console.log(data);
      })
      .catch(err=>{
        console.log(err);
      })
    }
  }

  return (
    <div className="App">
    <div className= "profile">
      First all the stuff to creat a profile
      <br />
      After that, input ens name/eth address , check balance, mint and transfer NFT.
    </div>
    <div className= "arch">
    <input id='ens' onKeyUp={setEns} placeholder ="Input ENS"></input>
    <br />
    If they don't have ENS:
    <input id = "address" onKeyUp = {setAddress} placeholder= "Eth Address"></input>
    <br/>
    <button onClick={transferNft}>transfer</button>
    </div>
    <button onClick={getName}>Name</button>
    </div>
  );
}

export default App;
