import { ethers } from 'ethers';
import NFT from './artifacts/contracts/NFT.sol/NFT.json';

const SampleTokenAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

function App() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  // for transfer operation

  // ropsten chainID => 3
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  // read-only
  const contract = new ethers.Contract(NFT, NFT.abi, provider)

  async function getName() {
    setName(await contract.name());
    console.log(name);
  }

  async function getSymbol() {
    setSymbol(await contract.symbol());
  }


/*  async function sendTokens() {
    // account private key, provider
    let walletSigner = new ethers.Wallet(signerPrivateKey, provider);
    const readWriteContract = new ethers.Contract(SampleTokenAddress, SampleToken.abi, walletSigner);
    let numberOfTokens = ethers.utils.parseUnits(amount, 18);
    console.log(`numberOfTokens: ${numberOfTokens}`);
    const transaction = await readWriteContract.transfer(toAccount, numberOfTokens);
    await transaction.wait();
    console.log(`${amount} Tokens successfully sent to ${toAccount}`);
  }
*/
  return (
    <div className="App">
    hi
    </div>
  );
}

export default App;
