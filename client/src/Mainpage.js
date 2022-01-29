import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';
import { useState , useEffect} from 'react';

//on ropsten:
const nftAddress = "0xc204C5e2253011397740275461543B0B3a2A0424";

function MainPage() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  // for transfer operation
  const[to,setTo]=useState('');
  const[ens,setEnsTo]=useState('');
  const [contract, setContract]=useState('undefined');
  const [signer,setSigner] = useState('');
  const [provider,setProvider] = useState('');
  const [accounts,setAccounts] = useState([]);
  const [images, setImages]=useState ([]);
  const [idNft, setIdNft]=useState ([]);


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

  async function getName() {
    setName(await contract.name());
    console.log(contract.name());
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
  async function mint(){
    let tokenIdcurr = await contract.connect(signer)._tokenIds();
    setIdNft(tokenIdcurr.toNumber())
    //await contract.connect(signer).createToken("https://media.istockphoto.com/vectors/welcome-to-the-team-hand-drawn-lettering-logo-icon-in-trendy-golden-vector-id1302839569?k=20&m=1302839569&s=612x612&w=0&h=rialOaZ0RMu1QsHjfUbZ0Q_d4LeAbIPz5V1SWpHi-yY=")

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
       if (balanceInEth > 0.0003){
         pass =true;
       }
       else{
         console.log('balance less than 0.0003 eth');
       }
      })
    }
    //gets the authorized address
    let auth = await contract.connect(signer).authorized();
    if(pass==true){
      //if conditions pass, mints and transfers nft.
      await contract.connect(signer).transferFrom(auth,to,idNft)
      .then(data=>{
        console.log(data);
      })
      .catch(err=>{
        console.log(err);
      })

    }
  }

  async function viewNfts(){
    let owned = []
    let uris=[]
    let id = (await contract.connect(signer)._tokenIds());
    for (let i =1;i<id.toNumber();i++){
      let owner = (await contract.connect(signer).ownerOf(i));
      let currAcc = ethers.utils.getAddress(accounts[0])
      console.log(owner);

      if (owner.toString() == currAcc){
        owned.push(i)
        uris.push(await contract.connect(signer).tokenURI(i))
      }
    }
    setImages(uris)
  }

  return (
    <div className="App">
    <div className= "profile">
    <a href ="/view">
    <button> View </button>
    </a>
    <br />
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
    <button onClick={connecter}>Connect</button>
    <button onClick = {viewNfts}>ViewNFTs </button>
    <button onClick ={mint} > Mint </button>
    <div>
    {
    images.map((item,index) => (
      <img src ={item} height ="300"/>
    ))}
    </div>
    </div>
  );
}

export default MainPage;
