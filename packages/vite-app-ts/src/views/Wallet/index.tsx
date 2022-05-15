import { Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import WalletInfoCard from '../common/WalletInfoCard';

import ExecutedPool from './components/ExecutedPool';
import TranscactionPool from './components/TranscactionPool';

import { IContractData } from '~~/models/Types';
import { fetchContracts } from '~~/services/BackendService';
import { useStore } from '~~/store/useStore';

const { TabPane } = Tabs;

function callback(key: any): void {}

const Index: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();

  const [time, setTime] = useState<string>();

  const [state, dispatch] = useStore();
  const { ethPrice, contracts } = state;

  const contractDetails = contracts?.find((data) => Number(data['contractId']) === Number(walletId));

  // -----------------
  //   to update contract list on page load
  // -----------------
  const updateContractList = useCallback(() => {
    return async (): Promise<void> => {
      const { ethersAppContext } = state;
      const contracts = await fetchContracts(ethersAppContext?.account as string);

      dispatch({ payload: { contracts } });

      const timeStamp: string = new Date().getTime().toString();
      setTime(timeStamp);
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
    <div className="m-5" key={String(state.ethersAppContext?.account) + String(state.ethersAppContext?.active)}>
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
