pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter public _tokenIds;
  address public authorized;

  constructor() ERC721("Web3List Token", "WLST") {
      authorized = msg.sender;
  }

  function createToken(string memory tokenURI) public returns (uint) {
      require(msg.sender == authorized, 'not authorized to create NFTs');
      _tokenIds.increment();
      uint256 newItemId = _tokenIds.current();
      _mint(msg.sender, newItemId);
      _setTokenURI(newItemId, tokenURI);
      return newItemId;
  }
}
