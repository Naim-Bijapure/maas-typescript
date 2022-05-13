/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { AppstoreAddOutlined as AddWalletIcon, FileOutlined, LoadingOutlined } from '@ant-design/icons';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { parseEther } from '@ethersproject/units';
import { Spin, Tooltip } from 'antd';
import { transactor, TTransactorFunc } from 'eth-components/functions';
import { BigNumberish } from 'ethers';
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
  const [serverState, setServerState] = useState(true);

  // -----------------
  //    fetch all contract  on load and updaet global state
  // -----------------
  const fetchAllContracts = async (): Promise<void> => {
    const { ethersAppContext } = state;
    try {
      const contracts = await fetchContracts(ethersAppContext?.account as string);
      dispatch({ payload: { contracts } });
      setServerState(true);
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
    const { ethersAppContext, multiSigFactory } = state;

    const notifyTx = transactor(ethComponentsSettings, ethersAppContext?.signer) as TTransactorFunc;

    const value = parseEther(parseFloat(fundAmount).toFixed(12));

    const createMultiSigTx = multiSigFactory?.create(
      ethersAppContext?.chainId as BigNumberish,
      addressList,
      signatureCount,
      { value: value }
    );
    const tx = (await notifyTx(createMultiSigTx)) as TransactionResponse;
    const rcpt: any = await tx.wait();

    const createEvent = rcpt.events.find((data: any) => data.event === 'Create');

    const contractData = { ...createEvent.args };

    const reqData: IContractData = {
      walletName,
      account: contractData['creator'],
      contractAddress: contractData['contractAddress'],
      contractId: contractData['contractId'].toNumber(),
      owners: contractData['owners'],
      signaturesRequired: contractData['signaturesRequired'].toNumber(),
      contractFundAmt: value.toString(),
    };

    // send contract data to server
    const response = await API.post('/createContract', reqData);
    console.log('create contract response: ', response);

    // fetch updated contract list
    await fetchAllContracts();

    setOpenModal(false);
  };

  useEffect(() => {
    void fetchAllContracts();
  }, [state.ethersAppContext?.account]);

  return (
    <>
      <Spin spinning={state.multiSigWallet === undefined && state.ethersAppContext?.active} indicator={SpinIcon}>
        <div className={state.ethersAppContext?.active ? ' m-5' : ' hidden'}>
          {/* wallet modal */}
          <WalletCreateModal
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
              <Tooltip title="Create wallet" placement="bottom">
                <AddWalletIcon className="text-4xl xl:mr-4" onClick={(): void => setOpenModal(true)} />
              </Tooltip>
            </div>
          </div>

          {/* display contract list */}
          {state.contracts?.length !== 0 && (
            <div className="flex flex-wrap justify-around xl:justify-start">
              {state.contracts?.map((data) => {
                return (
                  <>{<WalletInfoCard key={data['contractId']} contractDetails={data} isManageWalletScreen={true} />}</>
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
              <span className="m-2 text-2xl font-bold text-primary">No wallets found</span>
            </div>
          )}
        </div>

        {/* default icon when no metamask connected */}
        {!state.ethersAppContext?.active && (
          <div className="flex justify-center  mt-[10%] xl:mt-[10%]">
            <EthIcon />
          </div>
        )}

        {/* server down alert error */}
        <AlertModal openModal={!serverState} />
      </Spin>
    </>
  );
};

export default React.memo(Index);
