import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log('deployer: ', deployer);
  const CHAIN_ID = 31337;

  const multiSigFactoryDeployed = await deploy('MultiSigFactory', {
    from: deployer,
    log: true,
  });

  const MultiSigWalletDeployed = await deploy('MultiSigWallet', {
    from: deployer,
    args: [31337, ['0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'], 1, multiSigFactoryDeployed.address, 'default'],
    // args: ['default'],
    log: true,
  });

  console.log('multiSigFactoryDeployed.address: ', multiSigFactoryDeployed.address);
  console.log('MetaMultiSigWalletDeployed: ', MultiSigWalletDeployed.address);
};
export default func;
func.tags = ['MultiSigFactory', 'MultiSigWallet'];
