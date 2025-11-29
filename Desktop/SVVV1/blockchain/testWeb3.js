import web3 from "./connect.js";

const accounts = await web3.eth.getAccounts();
console.log(accounts);
