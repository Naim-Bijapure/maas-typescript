// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MultiSigWallet.sol";

contract MultiSigFactory {
  MultiSigWallet[] public multiSigs;
  mapping(address => bool) existsMultiSig;

<<<<<<< Updated upstream
  event Create(uint256 indexed contractId, address indexed contractAddress, address creator, address[] owners, uint256 signaturesRequired);

  event Owners(address indexed contractAddress, address[] owners, uint256 indexed signaturesRequired);
=======
  event Create(
    uint indexed contractId,
    address indexed contractAddress,
    address creator,
    address[] owners,
    uint signaturesRequired
  );

  event Owners(
    address indexed contractAddress,
    address[] owners,
    uint256 indexed signaturesRequired
  );

>>>>>>> Stashed changes

  constructor() {}

  modifier onlyRegistered() {
    require(existsMultiSig[msg.sender], "caller not registered to use logger");
    _;
  }

  function emitOwners(
    address _contractAddress,
    address[] memory _owners,
    uint256 _signaturesRequired
  ) external onlyRegistered {
    emit Owners(_contractAddress, _owners, _signaturesRequired);
  }

  function create(
    uint256 _chainId,
    address[] memory _owners,
<<<<<<< Updated upstream
    uint256 _signaturesRequired
  ) public payable {
    uint256 id = numberOfMultiSigs();

    MultiSigWallet multiSig = (new MultiSigWallet){ value: msg.value }(_chainId, _owners, _signaturesRequired, address(this));
=======
    uint _signaturesRequired
  ) public payable {
    uint id = numberOfMultiSigs();

    MultiSigWallet multiSig = (new MultiSigWallet){value: msg.value}(_chainId, _owners, _signaturesRequired, address(this));
>>>>>>> Stashed changes
    multiSigs.push(multiSig);
    existsMultiSig[address(multiSig)] = true;

    emit Create(id, address(multiSig), msg.sender, _owners, _signaturesRequired);
    emit Owners(address(multiSig), _owners, _signaturesRequired);
  }

<<<<<<< Updated upstream
  function numberOfMultiSigs() public view returns (uint256) {
=======
  function numberOfMultiSigs() public view returns(uint) {
>>>>>>> Stashed changes
    return multiSigs.length;
  }

  function getMultiSig(uint256 _index)
    public
    view
    returns (
      address multiSigAddress,
<<<<<<< Updated upstream
      uint256 signaturesRequired,
      uint256 balance
    )
  {
    MultiSigWallet multiSig = multiSigs[_index];
    return (address(multiSig), multiSig.signaturesRequired(), address(multiSig).balance);
  }
}
=======
      uint signaturesRequired,
      uint balance
    ) {
      MultiSigWallet multiSig = multiSigs[_index];
      return (address(multiSig), multiSig.signaturesRequired(), address(multiSig).balance);
    }
}
>>>>>>> Stashed changes
