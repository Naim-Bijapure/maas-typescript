import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { hexlify, hexZeroPad, parseEther } from 'ethers/lib/utils';
// import { MultiSigWallet } from 'contract-types';
// import { MultiSigFactory__factory } from 'contract-types/factories/MultiSigFactory__factory';
import { MultiSigFactory, MultiSigWallet__factory } from 'generated/contract-types';
import { ethers } from 'hardhat';
// import { it } from 'mocha';

describe('MultiSigFactory Test', () => {
  let MultiSigFactory: MultiSigFactory;
  let MultiSigWalletFactory: MultiSigWallet__factory;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3;
  let addrs;

  let provider: any;

  const CHAIN_ID = 1; // I guess this number doesn't really matter
  const signatureRequired = 1; // Starting with something straithforward

  // Running this before each test
  // Deploys MultiSigWallet and sets up some addresses for easier testing
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const MultisigFactoryFactory = await ethers.getContractFactory('MultiSigFactory');
    MultiSigWalletFactory = await ethers.getContractFactory('MultiSigWallet');

    MultiSigFactory = await MultisigFactoryFactory.deploy();
  });

  describe('Testing MultiSigWallet functionality', () => {
    it('deploy with create 2', async () => {
      /** ----------------------
       * wrap the string in to id and create hash and sort for salt
       * ---------------------*/
      const id = ethers.utils.id(owner.address + 'NNN');
      const hash = ethers.utils.keccak256(id);
      const salt = hexZeroPad(hexlify(hash), 32);
      let tx = await MultiSigFactory.create(CHAIN_ID, [owner.address], signatureRequired, salt, 'NN', { value: parseEther('1') });
      let rcpt = await tx.wait();
      let CreateEvent = rcpt.events?.find((eventData) => eventData.event === 'Create');
      let contractAddress = CreateEvent?.args?.contractAddress;

      let wallet = MultiSigWalletFactory.attach(contractAddress as string);
      let chainId = await wallet.chainId();
      let name = await wallet.name();
      let signaturesRequired = await wallet.signaturesRequired();
      let owners = await wallet.owners(0);
      let walletAddress = wallet.address;

      console.log('---------------- CHAIN ID 1-----------------------');
      console.log('MultiSigFactory address: ', MultiSigFactory.address);
      console.log('chainId: ', chainId.toNumber());
      console.log('name: ', name);
      console.log('signaturesRequired: ', signaturesRequired.toNumber());
      console.log('owners: ', owners);
      console.log('walletAddress: ', walletAddress);

      // different chain id
      const cId = 2;
      tx = await MultiSigFactory.create(cId, [owner.address], signatureRequired, salt, 'NNN', { value: parseEther('1') });
      rcpt = await tx.wait();
      CreateEvent = rcpt.events?.find((eventData) => eventData.event === 'Create');
      contractAddress = CreateEvent?.args?.contractAddress;

      wallet = MultiSigWalletFactory.attach(contractAddress as string);
      chainId = await wallet.chainId();
      name = await wallet.name();
      signaturesRequired = await wallet.signaturesRequired();
      owners = await wallet.owners(0);
      walletAddress = wallet.address;
      console.log('---------------- CHAIN ID 2-----------------------');
      console.log('MultiSigFactory address: ', MultiSigFactory.address);
      console.log('chainId: ', chainId.toNumber());
      console.log('name: ', name);
      console.log('signaturesRequired: ', signaturesRequired.toNumber());
      console.log('owners: ', owners);
      console.log('walletAddress: ', walletAddress);
    });
  });
});
