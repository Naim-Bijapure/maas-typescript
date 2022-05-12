import { Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import WalletInfoCard from '../common/WalletInfoCard';

import { IContractData } from '~~/models/Types';
import { fetchContracts } from '~~/services/BackendService';
import { useStore } from '~~/store/useStore';
import ExecutedPool from './components/ExecutedPool';
import TranscactionPool from './components/TranscactionPool';

const { TabPane } = Tabs;

function callback(key: any): void {}

const Index: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();

  const [time, setTime] = useState<any>();
  const [currentAccount, seCurrentAccount] = useState<string>();

  const [state, dispatch] = useStore();
  const { ethersAppContext, ethPrice, contracts, multiSigWallet } = state;

  const contractDetails = contracts?.find((data) => Number(data['contractId']) === Number(walletId));

  const updateContractList = useCallback(() => {
    return async (): Promise<void> => {
      const { ethersAppContext } = state;
      const contracts = await fetchContracts(ethersAppContext?.account as string);
      console.log('updateContractList: ', contracts);

      dispatch({ payload: { contracts } });

      setTime(new Date().getTime());
    };
  }, [walletId])();

  useEffect(() => {
    void updateContractList();
  }, [walletId]);

  // -----------------
  //   redirect page to home if no contract found
  // -----------------
  if (state.contracts?.length === 0) {
    return (
      <>
        <Redirect to="/" />
      </>
    );
  }

  return (
    <div className="m-5">
      <Tabs defaultActiveKey="1" centered onChange={callback} size={'large'} type="card">
        <TabPane tab="Wallet" key="1">
          <WalletInfoCard
            updateContractList={updateContractList}
            contractDetails={contractDetails as IContractData}
            isManageWalletScreen={false}
          />
        </TabPane>
        <TabPane tab="Transcaction pool" key="2">
          <TranscactionPool
            key={time}
            updateContractList={updateContractList}
            state={state}
            price={ethPrice as number}
            contractDetails={contractDetails as IContractData}
          />
        </TabPane>

        <TabPane tab="Executed proposals" key="3">
          <ExecutedPool key={time} price={ethPrice as number} contractDetails={contractDetails as IContractData} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default React.memo(Index);
