// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage_2 {
  uint storedData;

  function set(uint x) public {
    storedData = x*2;
  }

  function get() public view returns (uint) {
    return storedData+5;
  }
}
