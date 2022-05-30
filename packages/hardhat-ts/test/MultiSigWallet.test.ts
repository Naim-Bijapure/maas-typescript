// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
// import { expect } from 'chai';
// // import { MultiSigWallet } from 'contract-types';
// // import { MultiSigFactory__factory } from 'contract-types/factories/MultiSigFactory__factory';
// import { BytesLike } from 'ethers';
// import { ethers, waffle } from 'hardhat';

// describe.skip('MultiSigWallet Test', () => {
//   //   let MultiSigWallet: MultiSigWallet;
//   let MultiSigWallet: any;
//   let owner: SignerWithAddress;
//   let addr1: SignerWithAddress;
//   let addr2: SignerWithAddress;
//   let addr3;
//   let addrs;

//   let provider: any;

//   const CHAIN_ID = 1; // I guess this number doesn't really matter
//   const signatureRequired = 1; // Starting with something straithforward

//   // Running this before each test
//   // Deploys MultiSigWallet and sets up some addresses for easier testing
//   beforeEach(async function () {
//     [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

//     const MultiSigWalletInstance = await ethers.getContractFactory('MultiSigWallet');
//     const metaMultiSigFactoryInstance = await ethers.getContractFactory('MultiSigFactory');

//     const metaMultiSigFactory = await metaMultiSigFactoryInstance.deploy();

//     const createWalletTx = await metaMultiSigFactory.create(CHAIN_ID, [owner.address], signatureRequired);
//     const createWalletRcpt = await createWalletTx.wait();

//     const getWalletTx: any = await metaMultiSigFactory.getMultiSig(0);

//     // MultiSigWallet = await MultiSigWalletInstance.deploy(CHAIN_ID, [owner.address], signatureRequired, constants.AddressZero);
//     MultiSigWallet = await ethers.getContractAt('MultiSigWallet', getWalletTx[0] as string, metaMultiSigFactoryInstance.signer);

//     await owner.sendTransaction({
//       to: MultiSigWallet.address,
//       value: ethers.utils.parseEther('1.0'),
//     });

//     provider = owner.provider;

//     //     const monyoFactory = await ethers.getContractFactory('Monyo');
//     //     monyo = await monyoFactory.deploy(MultiSigWallet.address, ethers.utils.parseEther(MONYO_TOKEN_TOTAL_SUPPLY)); // Create Monyo ERC20 token, mint 100 to the multiSigWallet
//   });

//   // it('test', async () => {});
//   describe('Deployment', () => {
//     it('isOwner should return true for the owner address', async () => {
//       expect(await MultiSigWallet.isOwner(owner.address)).to.equal(true);
//     });
//   });

//   describe('Testing MultiSigWallet functionality', () => {
//     it('Adding a new signer', async () => {
//       const newSigner = addr2.address;

//       const nonce = await MultiSigWallet.nonce();
//       const to = MultiSigWallet.address;
//       const value = 0;

//       const callData = MultiSigWallet.interface.encodeFunctionData('addSigner', [newSigner, 1]);

//       const hash = await MultiSigWallet.getTransactionHash(nonce, to, value, callData);

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//       const signature: BytesLike = await waffle?.provider?.send('personal_sign', [hash, owner.address]);

//       // Double checking if owner address is recovered properly, executeTransaction would fail anyways
//       expect(await MultiSigWallet.recover(hash, signature)).to.equal(owner.address);

//       await MultiSigWallet.executeTransaction(MultiSigWallet.address, value, callData, [signature]);

//       const isOwner = await MultiSigWallet.isOwner(newSigner);
//       // console.log('isOwner: ', isOwner);

//       expect(await MultiSigWallet.isOwner(newSigner)).to.equal(true);
//     });

//     it('Update Signatures Required to 2 - locking all the funds in the wallet, becasuse there is only 1 signer', async () => {
//       const nonce = await MultiSigWallet.nonce();
//       const to = MultiSigWallet.address;
//       const value = 0;

//       const callData = MultiSigWallet.interface.encodeFunctionData('updateSignaturesRequired', [2]);

//       const hash = await MultiSigWallet.getTransactionHash(nonce, to, value, callData);

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//       const signature = await waffle?.provider?.send('personal_sign', [hash, owner.address]);

//       // Double checking if owner address is recovered properly, executeTransaction would fail anyways
//       expect(await MultiSigWallet.recover(hash, signature as BytesLike)).to.equal(owner.address);

//       await MultiSigWallet.executeTransaction(MultiSigWallet.address, value, callData, [signature as BytesLike]);

//       expect(await MultiSigWallet.signaturesRequired()).to.equal(2);
//     });

//     it('Transferring 0.1 eth to addr1', async () => {
//       const addr1BeforeBalance = await provider.getBalance(addr1.address);

//       const nonce = await MultiSigWallet.nonce();
//       const to: string = addr1.address;
//       const value = ethers.utils.parseEther('0.1');

//       const callData = '0x00'; // This can be anything, we could send a message

//       const hash = await MultiSigWallet.getTransactionHash(nonce, to, value.toString(), callData);

//       // const signature: BytesLike = await owner.provider.send('personal_sign', [hash, owner.address]);

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//       const signature: BytesLike = await waffle?.provider?.send('personal_sign', [hash, owner.address]);

//       await MultiSigWallet.executeTransaction(to, value.toString(), callData, [signature]);

//       const addr1Balance = await provider.getBalance(addr1.address);

//       expect(addr1Balance).to.equal(addr1BeforeBalance.add(value));
//     });
//   });
// });
