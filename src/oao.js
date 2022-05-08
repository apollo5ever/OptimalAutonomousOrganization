import React, {useState} from 'react'
import {ethers} from 'ethers';
import OAO_abi from './OAO_abi.json';

const OAO = () => {
	
	const contractAddress = '0x1f2d37fE5d95dEBFD1AbEb711977179Ef86a16F8';
	
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	
	
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	
	const connectWalletHandler = () => {
		if(window.ethereum) {
			window.ethereum.request({method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
		} else {
			setErrorMessage('Need to install Metamask!');
		}
	
	}
	
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}
	
	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);
		
		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);
		
		let tempContract = new ethers.Contract(contractAddress, OAO_abi,tempSigner);
		setContract(tempContract);
	}
	

	
	const transferSeat = (event) => {
		event.preventDefault();
		contract.transferSeat(event.target.newOwner.value,event.target.seat.value);
	}
	
	const openVote = (event) => {
		event.preventDefault();
		contract.openVote(event.target.action.value,event.target.seatOrAmount.value,event.target.ownerOrAddress.value);
	}
	
	const showHistory = async (event) => {
		event.preventDefault();
		//const cars = [];
		let cars = await contract.votes[0];
		//let val = contract.votes[event.target.index.value];
		console.log(JSON.parse(cars));
	}
	
	return (
		<div>
			<h1> {"Optimal Autonomous Organization"} </h1>
			
			<button onClick = {connectWalletHandler}> {connButtonText}</button>
			<h3> Address : {defaultAccount} </h3>
			<h3> Transfer Seat </h3>
			<form onSubmit={transferSeat}>
				<p> New Owner </p>
				<input id='newOwner' type='text' />
				<p> Seat ID </p>
				<input id='seat' type='text' />
				<button type={"submit"}> Transfer Seat </button>
			</form>
			
			<h3> Open Vote </h3>
			<form onSubmit={openVote}>
			<p> Action </p>
			<input id='action' type='text' />
			<p> Seat or Amount </p>
			<input id='seatOrAmount' type='text' />
			<p> Owner or Address </p>
			<input id='ownerOrAddress' type='text' />
			<button type={"submit"}> Open Vote </button>
			</form>
			
			<h3> Show Vote History </h3>
			<form onSubmit={showHistory}>
			<p>Index </p>
			<input id='index' type='text' />
			<button type={"submit"}> Show Vote </button>
			</form>

			{errorMessage}
		</div>
		)
}

export default OAO;
