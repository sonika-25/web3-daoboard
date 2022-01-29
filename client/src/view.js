import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { useState } from 'react';

//on ropsten:
const nftAddress = "0xc204C5e2253011397740275461543B0B3a2A0424";

function View() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  // for transfer operation
  const [contract, setContract]=useState('undefined');
  const [signer,setSigner] = useState('');
  const [provider,setProvider] = useState('');
  const [accounts,setAccounts] = useState([]);
  const [images, setImages]=useState ([])

  async function connecter (){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, NFT.abi, provider)
    setContract(contract);
    setSigner(signer);
    setProvider(provider);
    console.log(contract);
    console.log(signer);
    const { ethereum } = window
    		await ethereum.enable()
    		if (!ethereum) {
    			console.log("Make sure you have Metamask installed!")
    			return
    		} else {
    			console.log("Wallet exists! We're ready to go!")
    		}
    		const accounts = await ethereum.request({ method: "eth_accounts" })
    		if (accounts.length !== 0) {
    			const account = accounts[0]
          setAccounts(accounts);
    			console.log("Found an authorized account: ", account)
    		} else {
    			console.log("No authorized account found")
    		}
  }

  async function viewNfts(){
    let owned = []
    let uris=[]
    let id = (await contract.connect(signer)._tokenIds());
    for (let i =1;i<id.toNumber();i++){
      let owner = (await contract.connect(signer).ownerOf(i));
      let currAcc = ethers.utils.getAddress(accounts[0])
      /*console.log('atch');
      console.log(owner);
      console.log(currAcc);
      console.log(await contract.connect(signer).tokenURI(i));
      */
      if (owner.toString() == currAcc){
        owned.push(i)
        uris.push(await contract.connect(signer).tokenURI(i))
        //console.log(await contract.connect(signer).tokenURI(i));
      }
    }
    setImages(uris)
    console.log(await images);

  }

  return (
    <div className="App">
    <a href="/">
    <button>Homepage </button>
    </a>
    <button onClick={connecter}>Connect</button>
    <button onClick = {viewNfts}>ViewNFTs </button>

    <div>
    {
    images.map((item,index) => (
      <img src ={item} height ="300"/>
    ))}
    </div>
    </div>
  );
}

export default View;
