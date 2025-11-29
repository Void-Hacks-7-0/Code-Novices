import web3 from "./connect.js";

const sendTransaction = async () => {
  const accounts = await web3.eth.getAccounts();

  const receipt = await web3.eth.sendTransaction({
    from: accounts[0],
    to: accounts[1],
    value: web3.utils.toWei("1", "ether")   // 1 ETH bhej rahe hain
  });

  console.log("Transaction Receipt:", receipt);
};

sendTransaction();
