// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Owner.sol';

contract Faucet is Owner  {

    mapping(address => bool) public existFunders;
    mapping(uint => address) public funders;
    uint public numberOfFunders = 0; 


    modifier amountLimit (uint amount){
        require(amount <= 1000000000000000000,'cannot withdraw more than 1 ether');
        _;

    }




    function addFunds() external payable{
        address funder = msg.sender;

        if(!existFunders[funder]){
            uint index = numberOfFunders++;
            funders[index] = funder;
            existFunders[funder] = true;
        }

    }


    function withDrawFunds(uint amount) external amountLimit(amount) {

        payable(msg.sender).transfer(amount);

    }



}



// const instance = await Faucet.deployed()

// instance.addFunds({ from: "0x24667583F5D5fFe14FE39FE6f10FF37C93254C38" , amount: '1000000000000' })

// instance.withDrawFunds({ "20000000000000" , {from: accounts[1]})