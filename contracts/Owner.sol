// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owner {

    address owner;

    constructor(){

        owner = msg.sender;

    }


    modifier isOwner {

        require(msg.sender == owner,'should be owner to execute this function');
        _;
    }


    function transferOwnerShip(address newOwner) external isOwner {
        owner = newOwner;

    }



}