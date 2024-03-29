// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./atoken.sol";
import "./atokenBeacon.sol";

contract atokenFactory is Ownable{
    //mapping(uint32 => address) private collection;
    address[] public collectionList;

    atokenBeacon immutable beacon;

    constructor(address _impl) {
        beacon = new atokenBeacon(_impl);
    }

    event returnCollectionIdAndAddress(uint256 indexed collectionId, address collectionAddress);

    function createCollection(string memory _tokenUriPrefix, string memory _name, string memory _symbol, uint256 _maximumRoyaltyRate) public {
        BeaconProxy proxy = new BeaconProxy(
            address(beacon),
            //0xedef019
            abi.encodeWithSelector(atoken(address(0)).initialize.selector, _tokenUriPrefix, _name, _symbol, _maximumRoyaltyRate, 1, 2, 3, 4, 5, 6, 7) // max 12 arguments
        );
        //collection[_collectionId] = address(proxy);
        collectionList.push(address(proxy));

        emit returnCollectionIdAndAddress((collectionList.length), address(proxy));

    } 

    function getCollectionAddress(uint32 _collectionId) external view returns(address) {
        //return collection[_collectionId];
        return collectionList[_collectionId-1];
    }

    function getBeacon() public view returns(address) {
        return address(beacon);
    }

    function getImplementation() public view returns(address) {
        return beacon.implementation();
    }

    function getCollectionList() public view returns(address[] memory) {
        return collectionList;
    }

    function getCollectionName(uint32 _collectionId) public view returns(string memory) {
        //return atoken(collection[_collectionId]).name();
        return atoken(collectionList[_collectionId-1]).name();
    }
    
    function getCollectionNameList() public view returns(string[] memory) {
        string[] memory collectionNameListArray = new string[](collectionList.length);
        for(uint i = 0; i < collectionList.length; i++) {
            collectionNameListArray[i] = (atoken(collectionList[i]).name());
        }
        return collectionNameListArray;
    }

    function getCollectionUri(uint32 _collectionId) public view returns(string memory) {
        return atoken(collectionList[_collectionId-1]).uri(0);
    }

    function getCollectionUriList() public view returns(string[] memory) {
        string[] memory collectionUriListArray = new string[](collectionList.length);
        for(uint i = 0; i < collectionList.length; i++) {
            collectionUriListArray[i] = (atoken(collectionList[i]).uri(0));
        }
        return collectionUriListArray;
    }
    
}