import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { formatEther, hexlify, hexZeroPad, parseEther } from 'ethers/lib/utils';
// import { MultiSigWallet } from 'contract-types';
// import { MultiSigFactory__factory } from 'contract-types/factories/MultiSigFactory__factory';
import { MultiSigFactory, MultiSigWallet__factory } from 'generated/contract-types';
import { ethers } from 'hardhat';
import { it } from 'mocha';

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
      console.log('MultiSigFactory: ', MultiSigFactory.address);
      /** ----------------------
       * wrap the string in to id and create hash and sort for salt
       * ---------------------*/
      const id = ethers.utils.id(owner.address + 'NNN');
      const hash = ethers.utils.keccak256(id);
      const salt = hexZeroPad(hexlify(hash), 32);
      const tx = await MultiSigFactory.create(CHAIN_ID, [owner.address], signatureRequired, salt, 'NNN', { value: parseEther('1') });
      const rcpt = await tx.wait();
      const CreateEvent = rcpt.events?.find((eventData) => eventData.event === 'Create');
      const contractAddress = CreateEvent?.args?.contractAddress;

      const mWallet = MultiSigWalletFactory.attach(contractAddress as string);
      const name = await mWallet.name();
      const sig = await mWallet.signaturesRequired();
      const owners = await mWallet.owners(0);

      const walletBalance = await ethers.provider.getBalance(contractAddress as string);
      console.log('walletBalance: ', formatEther(walletBalance.toString()));
      console.log('owners: ', owners);
      console.log('sig: ', sig.toString());
      console.log('name: ', name);
      console.log('mWallet: ', mWallet.address);
    });
  });
});
