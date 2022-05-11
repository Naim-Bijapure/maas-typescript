import { TransactionResponse } from '@ethersproject/abstract-provider';
import { notification, Tabs } from 'antd';
import { transactor } from 'eth-components/functions';
import { BytesLike } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import WalletInfoCard from '../common/WalletInfoCard';

import ProposalSignCard from './components/ProposalSignCard';

import API from '~~/config/API';
import { ethComponentsSettings } from '~~/config/app.config';
import { IContractData, IProposal, IStoreState } from '~~/models/Types';
import { fetchContracts } from '~~/services/BackendService';
import { useStore } from '~~/store/useStore';

const { TabPane } = Tabs;

function callback(key: any): void {}

interface ITranscactionPool {
  contractDetails: IContractData;
  price: number;
  state: IStoreState;
  updateContractList?: () => Promise<void>;
}

const TranscactionPool: React.FC<ITranscactionPool> = ({ contractDetails, price, state, updateContractList }) => {
  const [currentNonce, setCurrentNonce] = useState<number | undefined>(undefined);
  const [executableProposal, setExecutableProposal] = useState<IProposal | undefined>(undefined);

  const proposals: IProposal[] = contractDetails.proposals as IProposal[];

  const updateExecutable = async (): Promise<void> => {
    const currentMultiSigWallet = state.multiSigWallet?.attach(contractDetails.contractAddress);
    const nonce = await currentMultiSigWallet?.nonce();
    const currentNonce = nonce?.toNumber();
    setCurrentNonce(currentNonce);
    if (proposals.length > 0) {
      const currentExecutable = proposals.find(
        (data) =>
          data.nonce === currentNonce && data.signatureRequired === data?.signatures.length && data.isExecuted === false
      );

      setExecutableProposal(currentExecutable);
    }
  };

  // on sign the transcaction
  const onSignTranscaction = async (proposalId: number): Promise<void> => {
    const { multiSigWallet } = state;
    const currentMultiSigWallet = multiSigWallet?.attach(contractDetails.contractAddress);

    const selectedProposal = proposals.find((data) => data.proposalId === proposalId);

    const nextNonce = Number(selectedProposal?.proposalId) - 1;

    const mainHash = await currentMultiSigWallet?.getTransactionHash(
      nextNonce,
      selectedProposal?.to as string,
      selectedProposal?.value as string,
      selectedProposal?.callData as string
    );

    // discard hash
    const discardHash = await currentMultiSigWallet?.getTransactionHash(
      nextNonce,
      selectedProposal?.to as string,
      '0',
      '0x'
    );

    // sign
    const sign = await state.ethersAppContext?.provider?.send('personal_sign', [
      mainHash,
      state.ethersAppContext.account,
    ]);

    // discard sign
    const discardSign = await state.ethersAppContext?.provider?.send('personal_sign', [
      discardHash,
      state.ethersAppContext.account,
    ]);
    const recoverAddress = await currentMultiSigWallet?.recover(mainHash as string, sign as string);
    const isOwner = await currentMultiSigWallet?.isOwner(recoverAddress as string);
    if (isOwner) {
      const reqData = {
        contractId: contractDetails.contractId,
        proposalId,
        sign,
        discardSign,
        owner: recoverAddress,
      };
      // send the transcaction
      const resSignature = await API.post(`/proposal/signAdd`, { ...reqData });

      notification['success']({ message: 'Added signature successfully' });
      updateContractList && (await updateContractList());
      await updateExecutable();
    }
  };

  // on execute the transcaction
  const onExecuteTranscaction = async (proposalId: number, isDiscard?: boolean): Promise<void> => {
    console.log('proposalId: ', proposalId);
    const { multiSigWallet } = state;
    const currentMultiSigWallet = multiSigWallet?.attach(contractDetails.contractAddress);

    const selectedProposal = proposals.find((data) => data.proposalId === proposalId);
    console.log('selectedProposal: ', selectedProposal);
    const notifyTx: any = transactor(ethComponentsSettings, state.ethersAppContext?.signer);

    const sign = await state.ethersAppContext?.provider?.send('personal_sign', [
      selectedProposal?.hash,
      state.ethersAppContext.account,
    ]);
    const recoverAddress = await currentMultiSigWallet?.recover(selectedProposal?.hash as string, sign as string);
    console.log('recoverAddress: ', recoverAddress);

    const isOwner = await currentMultiSigWallet?.isOwner(recoverAddress as string);

    if (isOwner) {
      const signitures: any[] = (selectedProposal as IProposal).signatures
        .sort((dataA: any, dataB: any) => dataA['owner'] - dataB['owner'])
        .map((data: { owner: any; sign: string }) => data?.sign);
      console.log('signitures: ', signitures);

      const discardSignitures: any[] = (selectedProposal as IProposal).discardSignatures
        .sort((dataA: any, dataB: any) => dataA['owner'] - dataB['owner'])
        .map((data: { owner: any; sign: string }) => data?.sign);

      const finalSignatures = isDiscard === false ? signitures : discardSignitures;

      const to = selectedProposal?.to as string;
      const value = isDiscard === false ? (selectedProposal?.value as string) : '0';
      const callData = isDiscard === false ? (selectedProposal?.callData as string) : '0x';

      const execTx = currentMultiSigWallet?.executeTransaction(to, value, callData, [
        ...(finalSignatures as BytesLike[]),
      ]);

      const tx = (await notifyTx(execTx)) as TransactionResponse;
      const rcpt: any = await tx.wait();
      // /proposal/execute

      const reqData = {
        contractId: contractDetails.contractId,
        proposalId,
        isDiscard,
      };
      const resExecute = await API.post(`/proposal/execute`, reqData);
      console.log('resExecute: ', resExecute.data);

      updateContractList && (await updateContractList());
      await updateExecutable();
      notification['success']({ message: 'Transcaction executed successfully' });

      // notifyTx(execTx, async (data: any) => {
      //   // const res = await API.post(`/add`, { transcactions: [...transcactions] });

      // });
    }
  };

  useEffect(() => {
    void updateExecutable();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <div className="w-full  xl:w-[50%] ">
          {executableProposal && (
            <ProposalSignCard
              account={contractDetails.account}
              proposalData={executableProposal}
              price={price}
              onExecuteTranscaction={onExecuteTranscaction}
              isExecutable
            />
          )}
        </div>
      </div>
      <div className="text-2xl font-bold divider">Sign pool</div>

      <div className="flex flex-wrap justify-center">
        {proposals
          .filter((data) => data.signatureRequired !== data.signatures.length)
          ?.map((data) => {
            return (
              <div key={data.proposalId} className="w-full mt-2 xl:w-[40%] xl:m-2">
                <ProposalSignCard
                  account={contractDetails.account}
                  onSignTranscaction={onSignTranscaction}
                  price={price}
                  proposalData={data}
                  isExecutable={false}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

interface IExecutedPool {
  contractDetails: IContractData;
  price: number;
}

const ExecutedPool: React.FC<IExecutedPool> = ({ contractDetails, price }) => {
  const proposals: IProposal[] = contractDetails.proposals as IProposal[];

  return (
    <>
      <div className="flex flex-wrap justify-center ">
        {proposals
          .filter((data) => data.isExecuted === true)
          ?.map((data) => {
            return (
              <div key={data.proposalId} className="w-full mt-4 xl:w-[40%] xl:m-4 ">
                <ProposalSignCard
                  account={contractDetails.account}
                  // onSignTranscaction={onSignTranscaction}
                  price={price}
                  proposalData={data}
                  isExecutable={false}
                  isExecuted
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

const Index: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();

  const [time, setTime] = useState<any>();

  const [state, dispatch] = useStore();
  const { ethersAppContext, ethPrice, contracts, multiSigWallet } = state;

  const contractDetails = contracts?.find((data) => Number(data['contractId']) === Number(walletId));

  const updateContractList = useCallback(() => {
    return async (): Promise<void> => {
      const { ethersAppContext } = state;
      const contracts = await fetchContracts(ethersAppContext?.account as string);
      console.log('contracts: ', contracts);

      dispatch({ payload: { contracts } });
      setTime(new Date().getTime());
    };
  }, [walletId])();

  useEffect(() => {
    void updateContractList();
  }, [walletId]);

  // on page reload no contract then redirect it to  main page
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
