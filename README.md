To run:

clone this repo
install dependencies: "npm install"
Rename keys.example.json to keys.json and put your ropsten privateKey there. (Make sure that the address has some ropsten eth or get it from a faucet.)
migrate contracts : "npx hardhat run scripts/sample-script.js --network ropsten"
This will return an address and an owner(your address). Put the address in the file 'app.js' in the client/src folder under the variable nftAddress.

Now go to the client folder in your terminal and run "npm start".
Make sure that your MetaMask network is ropsten.
#   w e b 3 - d a o b o a r d  
 #   w e b 3 - d a o b o a r d  
 