/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  AppstoreAddOutlined as AddWalletIcon,
  FileOutlined,
  LoadingOutlined,
  LoginOutlined as LoginIcon,
} from '@ant-design/icons';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { hexZeroPad, hexlify } from '@ethersproject/bytes';
import { parseEther } from '@ethersproject/units';
import { notification } from 'antd';
import { transactor, TTransactorFunc } from 'eth-components/functions';
import { TEthersModalConnector } from 'eth-hooks/context';
import { BigNumberish, utils } from 'ethers';
import React, { useEffect, useState } from 'react';

// import MyIcon from '../../eth_icon.svg?component';
import AlertModal from '../common/AlertModal';
import WalletInfoCard from '../common/WalletInfoCard';

import WalletCreateModal from './components/WalleCreateModal';

// @ts-ignore
import EthIcon from '~~/assets/eth_icon.svg?component';
import API from '~~/config/API';
import { ethComponentsSettings } from '~~/config/app.config';
import { IContractData } from '~~/models/Types';
import { fetchContracts } from '~~/services/BackendService';
import { useStore } from '~~/store/useStore';

const SpinIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Index: React.FC<any> = () => {
  const [state, dispatch] = useStore();

  const [openModal, setOpenModal] = useState(false);
  const [deployType, setDeployType] = useState<'New' | 'Redeploy'>();
  const [walletName, setWalletName] = useState<string>('');

  const [serverState, setServerState] = useState(true);

  // -----------------
  //    fetch all contract  on load and updaet global state
  // -----------------
  const fetchAllContracts = async (): Promise<void> => {
    const { ethersAppContext, isUserLoggedIn } = state;
    try {
      if (ethersAppContext?.active) {
        const contracts = await fetchContracts(
          ethersAppContext?.account as string,
          ethersAppContext?.chainId as number
        );
        dispatch({ payload: { contracts } });
        setServerState(true);
      }
    } catch (error) {
      setServerState(false);
    }
  };

  // on creaet wallet
  const onWalletCreate = async (
    walletName: string,
    addressList: Array<string>,
    signatureCount: number,
    fundAmount: string = '0'
  ): Promise<any> => {
    try {
      const { ethersAppContext, multiSigFactory } = state;

      const id = utils.id(String(state.ethersAppContext?.account) + walletName);
      const hash = utils.keccak256(id);
      const salt = hexZeroPad(hexlify(hash), 32);

      const notifyTx = transactor(ethComponentsSettings, ethersAppContext?.signer) as TTransactorFunc;

      const value = parseEther(parseFloat(fundAmount).toFixed(12));

      // const createMultiSigTx = multiSigFactory?.create(
      //   ethersAppContext?.chainId as BigNumberish,
      //   addressList,
      //   signatureCount,
      //   { value: value }
      // );

      const createMultiSigTx = multiSigFactory?.create(
        ethersAppContext?.chainId as BigNumberish,
        addressList,
        signatureCount,
        salt,
        walletName,
        { value: value }
      );
      const tx = (await notifyTx(createMultiSigTx)) as TransactionResponse;
      const rcpt: any = await tx.wait();

      const createEvent = rcpt.events.find((data: any) => data.event === 'Create');

      const contractData = { ...createEvent.args };
      // console.log('contractData: ', contractData);

      const reqData: IContractData = {
        walletName,
        chainIds: [state.ethersAppContext?.chainId as number],
        account: contractData['creator'],
        contractAddress: contractData['contractAddress'],
        contractId: contractData['contractId'].toNumber(),
        owners: contractData['owners'],
        signaturesRequired: contractData['signaturesRequired'].toNumber(),
        contractFundAmt: value.toString(),
        proposals: [],
      };

      // send contract data to server
      const response = await API.post('/createContract', reqData);
      console.log('create contract response: ', response);

      // fetch updated contract list
      await fetchAllContracts();

      setOpenModal(false);
    } catch (error) {
      console.log('error: ', error);
      notification['error']({
        message: 'Deploy contract error',
        description: 'Error on creating contract please choose different wallet name',
      });
    }
  };

  const onRedeploy = (walletName: string): any => {
    console.log('walletName: ', walletName);
    setDeployType('Redeploy');
    setOpenModal(true);
    setWalletName(walletName);
  };

  useEffect(() => {
    void fetchAllContracts();
  }, [state.ethersAppContext?.account]);

  useEffect(() => {
    console.log('state: ', state);
    const isUserLoggedIn = window.localStorage.getItem('maas-userLogin');
    console.log('isUserLoggedIn: ', isUserLoggedIn);
    if (isUserLoggedIn === null) {
      setTimeout(() => {
        state.ethersAppContext?.deactivate();
        state.ethersAppContext?.disconnectModal();
      }, 1);

      // TODO:DISPLAY LOGIN MODAL ON RELOAD
      // setTimeout(() => {
      //   const connector = state.scaffoldAppProviders?.createLoginConnector?.();
      //   state.ethersAppContext?.openModal(connector as TEthersModalConnector, () => {
      //     alert('login error');
      //   });
      //   window.localStorage.setItem('maas-userLogin', 'true');
      // }, 100);
    }
  }, [state.isUserLoggedIn]);

  return (
    <>
      {/* <Spin
        spinning={state.ethersAppContext?.active === false && state.isUserLoggedIn === true}
        indicator={SpinIcon}
        style={{ zIndex: -100 }}> */}
      <div className={state.ethersAppContext?.active ? ' m-5' : ' hidden'}>
        {/* wallet modal */}
        <WalletCreateModal
          deployWalletName={walletName}
          key={walletName}
          deployType={deployType}
          openModal={openModal}
          price={state.ethPrice as number}
          provider={state.ethersAppContext?.provider}
          currentAccount={state.ethersAppContext?.account as string}
          onSubmit={onWalletCreate}
          onClose={(): void => setOpenModal(false)}
        />
        <div className="flex  items-center justify-around xl:flex xl:flex-row xl:justify-between ">
          <div className="text-3xl font-bold  xl:text-5xl ">Your wallets</div>
          <div>
            <button className="btn btn-secondary " onClick={(): void => setOpenModal(true)}>
              <span>Create wallet</span>
              <AddWalletIcon className="mx-1 text-2xl" />
            </button>
          </div>
        </div>

        {/* display contract list */}
        {state.contracts?.length !== 0 && (
          <div className="flex flex-wrap justify-around xl:justify-start">
            {state.contracts?.map((data, index) => {
              const isReDeploy = data.chainIds.includes(state.ethersAppContext?.chainId as number) === false;
              // const isReDeploy = true;
              return (
                <>
                  {
                    <WalletInfoCard
                      isReDeploy={isReDeploy}
                      onRedeploy={onRedeploy}
                      key={index}
                      contractDetails={data}
                      isManageWalletScreen={true}
                    />
                  }
                </>
              );
            })}
          </div>
        )}

        {/* if no contracts found  */}
        {state.contracts?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-[50%] xl:mt-[10%]">
            <div>
              <FileOutlined className="text-9xl" />
            </div>
            <span className="m-2 text-2xl font-bold text-primary">Create your first wallet</span>
          </div>
        )}
      </div>

      {/* default icon when no metamask connected with connect to app button */}
      {!state.ethersAppContext?.active && (
        <div className="flex flex-col items-center justify-center  mt-[10%] xl:mt-[10%]">
          <EthIcon />
          <button
            className="m-10 btn btn-primary"
            onClick={(): void => {
              const connector = state.scaffoldAppProviders?.createLoginConnector?.();
              state.ethersAppContext?.openModal(connector as TEthersModalConnector, () => {
                alert('login error');
              });
              dispatch({ payload: { isUserLoggedIn: true } });
              window.localStorage.setItem('maas-userLogin', 'true');
            }}>
            <span className="mx-2">Connect to app</span>
            <LoginIcon className="text-2xl" />
          </button>
        </div>
      )}

      {/* server down alert error */}
      <AlertModal openModal={!serverState} />
      {/* </Spin> */}
    </>
  );
};

// const checkProps = (prePros: any, nextProps: any): boolean => {
// console.log('prePros,nextProps: ', prePros, nextProps);
//   return false;
// };

export default React.memo(Index);
