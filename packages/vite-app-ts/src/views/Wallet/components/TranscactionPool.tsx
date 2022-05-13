import { FileExclamationOutlined } from '@ant-design/icons';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { notification } from 'antd';
import { transactor } from 'eth-components/functions';
import { BytesLike } from 'ethers';
import React, { useEffect, useState } from 'react';

import ProposalSignCard from './ProposalSignCard';

import API from '~~/config/API';
import { ethComponentsSettings } from '~~/config/app.config';
import { IContractData, IProposal, IStoreState } from '~~/models/Types';

interface ITranscactionPool {
  contractDetails: IContractData;
  price: number;
  state: IStoreState;
  updateContractList?: () => Promise<void>;
}

const TranscactionPool: React.FC<ITranscactionPool> = ({ contractDetails, price, state, updateContractList }) => {
  const [currentNonce, setCurrentNonce] = useState<number | undefined>(undefined);
  const [executableProposal, setExecutableProposal] = useState<IProposal | undefined>(undefined);
  const [inQueProposals, setInQueProposals] = useState<number>(0);

  const proposals: IProposal[] = contractDetails.proposals as IProposal[];

  // -----------------
  //   update list for executable contract and display on main list
  // -----------------
  const updateExecutable = async (): Promise<void> => {
    const currentMultiSigWallet = state.multiSigWallet?.attach(contractDetails.contractAddress);
    const nonce = await currentMultiSigWallet?.nonce();
    const currentNonce = nonce?.toNumber();
    setCurrentNonce(currentNonce);
    if (proposals.length > 0) {
      const currentExecutable = proposals.find(
        (data) =>
          data.nonce === currentNonce &&
          data.signatureRequired === data?.signatures.length &&
          data.isExecuted === false &&
          data.owners?.includes(state.ethersAppContext?.account as string)
      );

      setExecutableProposal(currentExecutable);
      const totalExecutableProposals = proposals.filter(
        (data) => data.signatureRequired === data?.signatures.length && data.isExecuted === false
      );

      setInQueProposals(totalExecutableProposals.length);
    }
  };

  // on sign the transcaction
  const onSignTranscaction = async (proposalId: number): Promise<void> => {
    const { multiSigWallet } = state;
    const currentMultiSigWallet = multiSigWallet?.attach(contractDetails.contractAddress);

    const selectedProposal = proposals.find((data) => data.proposalId === proposalId);

    const nextNonce = Number(selectedProposal?.proposalId) - 1;

    // main hash
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
      console.log('resSignature: ', resSignature);

      notification['success']({ message: 'Added signature successfully' });
      updateContractList && (await updateContractList());
      await updateExecutable();
    }
  };

  // on execute the transcaction
  const onExecuteTranscaction = async (proposalId: number, isDiscard?: boolean): Promise<void> => {
    const { multiSigWallet } = state;
    const currentMultiSigWallet = multiSigWallet?.attach(contractDetails.contractAddress);

    const selectedProposal = proposals.find((data) => data.proposalId === proposalId);

    const notifyTx: any = transactor(ethComponentsSettings, state.ethersAppContext?.signer);

    const sign = await state.ethersAppContext?.provider?.send('personal_sign', [
      selectedProposal?.hash,
      state.ethersAppContext.account,
    ]);
    const recoverAddress = await currentMultiSigWallet?.recover(selectedProposal?.hash as string, sign as string);

    const isOwner = await currentMultiSigWallet?.isOwner(recoverAddress as string);

    if (isOwner) {
      // sort the required signature in order
      const signitures: any[] = (selectedProposal as IProposal).signatures
        .sort((dataA: any, dataB: any) => dataA['owner'] - dataB['owner'])
        .map((data: { owner: any; sign: string }) => data?.sign);

      // sort the discard required signature in order
      const discardSignitures: any[] = (selectedProposal as IProposal).discardSignatures
        .sort((dataA: any, dataB: any) => dataA['owner'] - dataB['owner'])
        .map((data: { owner: any; sign: string }) => data?.sign);

      const finalSignatures = isDiscard === false ? signitures : discardSignitures;

      // prepare final values
      const to = selectedProposal?.to as string;
      const value = isDiscard === false ? (selectedProposal?.value as string) : '0';
      const callData = isDiscard === false ? (selectedProposal?.callData as string) : '0x';

      const execTx = currentMultiSigWallet?.executeTransaction(to, value, callData, [
        ...(finalSignatures as BytesLike[]),
      ]);

      const tx = (await notifyTx(execTx)) as TransactionResponse;
      const rcpt: any = await tx.wait();
      // /proposal/execute

      const finalSignaturesCount =
        selectedProposal?.signatureRequired !== selectedProposal?.newSignatureCount
          ? selectedProposal?.newSignatureCount
          : selectedProposal?.signatureRequired;
      const finalOwnerList = [...(selectedProposal?.updatedOwnerList as string[])];

      const reqData = {
        contractId: contractDetails.contractId,
        proposalId,
        isDiscard,
        finalSignaturesCount,
        finalOwnerList,
      };

      const resExecute = await API.post(`/proposal/execute`, reqData);
      console.log('resExecute: ', resExecute);

      updateContractList && (await updateContractList());
      await updateExecutable();
      notification['success']({ message: 'Transcaction executed successfully' });
    }
  };

  useEffect(() => {
    void updateExecutable();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        {/* display current executable proposal */}
        <div className="w-full  xl:w-[50%] ">
          {executableProposal && (
            <ProposalSignCard
              account={state.ethersAppContext?.account as string}
              proposalData={executableProposal}
              price={price}
              onExecuteTranscaction={onExecuteTranscaction}
              isExecutable
            />
          )}
        </div>

        {/* pending proposal in que */}
        {inQueProposals > 0 && (
          <div className="mt-2 text-sm font-bold text-accent text-opacity-70">
            {inQueProposals - 1} proposals in que
          </div>
        )}
        {/* if no proposals */}
        {inQueProposals === 0 && (
          <div className="m-5 shadow-lg xl:w-1/6 alert alert-info">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="flex-shrink-0 w-6 h-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>No executable proposals</span>
            </div>
          </div>
        )}
      </div>
      {/* signature pool list */}
      <div className="text-2xl font-bold divider">Sign pool</div>
      {proposals.length > 0 && (
        <div className="flex flex-wrap justify-center">
          {proposals
            .filter(
              (data) =>
                data.signatureRequired !== data.signatures.length &&
                data.owners?.includes(state.ethersAppContext?.account as string)
            )

            .sort((dataA, dataB) => dataB.proposalId - dataA.proposalId)
            ?.map((data) => {
              return (
                <div key={data.proposalId} className="w-full mt-2 xl:w-[40%] xl:m-2">
                  <ProposalSignCard
                    // account={contractDetails.account}

                    account={state.ethersAppContext?.account as string}
                    onSignTranscaction={onSignTranscaction}
                    price={price}
                    proposalData={data}
                    isExecutable={false}
                  />
                </div>
              );
            })}
        </div>
      )}
      {/* if no data in pool */}
      {proposals.filter(
        (data) =>
          data.signatureRequired !== data.signatures.length &&
          data.owners?.includes(state.ethersAppContext?.account as string)
      ).length === 0 && (
        <div className="flex flex-wrap justify-center mt-[70%]  md:mt-[20%]">
          <div className=" text-5xl">
            <FileExclamationOutlined />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TranscactionPool);
