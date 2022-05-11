/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { AppstoreAddOutlined as AddWalletIcon } from '@ant-design/icons';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { parseEther } from '@ethersproject/units';
import { Tooltip } from 'antd';
import { transactor, TTransactorFunc } from 'eth-components/functions';
import { BigNumberish } from 'ethers';
import React, { useEffect, useState } from 'react';

import WalletInfoCard from '../common/WalletInfoCard';

import WalletCreateModal from './components/WalleCreateModal';

import API from '~~/config/API';
import { ethComponentsSettings } from '~~/config/app.config';
import { IContractData } from '~~/models/Types';
import { useStore } from '~~/store/useStore';
import { fetchContracts } from '~~/services/BackendService';

// interface IContractList {
// scaffoldAppProviders: IScaffoldAppProviders;
// account: string;
// }

const Index: React.FC<any> = () => {
  const [state, dispatch] = useStore();
  const [openModal, setOpenModal] = useState(false);

  const fetchAllContracts = async (): Promise<void> => {
    const { ethersAppContext } = state;
    const contracts = await fetchContracts(ethersAppContext?.account as string);
    dispatch({ payload: { contracts } });
  };

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
    console.log('response: ', response.data);
    // fetch updated contract list
    await fetchAllContracts();

    setOpenModal(false);
  };

  useEffect(() => {
    void fetchAllContracts();
  }, [state.ethersAppContext?.account]);

  return (
    <div className="m-5">
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
      <div className="flex flex-wrap justify-around xl:justify-start">
        {state.contracts?.length !== 0 &&
          state.contracts?.map((data) => {
            return (
              <>{<WalletInfoCard key={data['contractId']} contractDetails={data} isManageWalletScreen={true} />}</>
            );
          })}
      </div>
    </div>
  );
};

// to memoize the component
// const checkProps = (preProps: IContractList, nextProps: IContractList): boolean => {
//   return nextProps.account === preProps.account;
// };
export default React.memo(Index);
