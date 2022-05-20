// import { DeployFunction } from 'hardhat-deploy/types';
// import { HardhatRuntimeEnvironment } from 'hardhat/types';

// const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
//   const { getNamedAccounts, deployments } = hre;
//   const { deploy } = deployments;
//   const { deployer } = await getNamedAccounts();
//   console.log('deployer: ', deployer);
//   const CHAIN_ID = 31337;

//   const YourFactory = await deploy('YourFactory', {
//     from: deployer,
//     log: true,
//   });

//   const YourContract = await deploy('YourContract', {
//     from: deployer,
//     // args: [31337, ['0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'], 1, YourFactory.address],
//     args: ['on deploy data'],
//     log: true,
//   });

//   console.log('YourFactory address ', YourFactory.address);
//   console.log('YourContract:address ', YourContract.address);
// };
// export default func;
// func.tags = ['YourFactory', 'YourContract'];
