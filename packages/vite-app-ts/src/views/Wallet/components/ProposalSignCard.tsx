/* eslint-disable @typescript-eslint/no-misused-promises */
import { ArrowRightOutlined as ArrowRightIcon } from '@ant-design/icons';
import { Balance, Blockie } from 'eth-components/ant';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';

import ProposalInfoModal from './ProposalInfoModal';

import { IProposal } from '~~/models/Types';

interface IProposalSignCard {
  isExecutable?: boolean;
  isExecuted?: boolean;
  account: string;
  proposalData: IProposal;
  price: number;
  onSignTranscaction?: (proposalId: number) => Promise<void>;
  onExecuteTranscaction?: (proposalId: number, isDiscard?: boolean) => Promise<void>;
}
const ProposalSignCard: React.FC<IProposalSignCard> = ({
  isExecutable,
  isExecuted,
  account,
  proposalData,
  price,
  onSignTranscaction,
  onExecuteTranscaction,
}) => {
  //   console.log('proposalData: ', proposalData);
  const [signCheck, setSignCheck] = useState(false);

  const onSign = async (): Promise<void> => {
    onSignTranscaction && (await onSignTranscaction(Number(proposalData.proposalId)));
    //     setSignCheck(true);
  };

  const onExecute = async (isDiscard: boolean): Promise<void> => {
    onExecuteTranscaction && (await onExecuteTranscaction(Number(proposalData.proposalId), isDiscard));
    //     setSignCheck(true);
  };

  useEffect(() => {
    const findSignature = proposalData.signatures.find((data) => data.owner === account);
    if (findSignature !== undefined) {
      setSignCheck(true);
    }

    if (findSignature === undefined) {
      setSignCheck(false);
    }
  }, [proposalData.signatures.length]);

  return (
    <div className="w-full xl:w-full ">
      <div
        className={
          isExecutable
            ? 'w-full  shadow-xl card bg-base-100  border-green-400	 border-4'
            : 'w-full  shadow-xl card bg-base-300'
        }>
        <div className="text-left card-body">
          {/* heading */}
          <h2 className="flex justify-between card-title ">
            <div>
              <span className="mx-2">
                {'#'} {proposalData.nonce}
              </span>
              <span>{proposalData.eventName}</span>
            </div>
            <ProposalInfoModal />
          </h2>
          {/* content */}

          {/* value */}
          <div className=" text-3xl font-bold">
            <Balance address="" balance={BigNumber.from(proposalData['value'] as string)} dollarMultiplier={price} />
          </div>
          {/* to from */}
          <div className="flex items-center justify-between my-5">
            <div className="avatar">
              <div className="rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <Blockie scale={5} address={proposalData.from as string} />
              </div>
            </div>
            <div className="text-sm font-bold xl:text-lg">
              {proposalData.from?.slice(0, 4)}...{proposalData.from?.slice(38)}
            </div>
            <div>
              <ArrowRightIcon />
            </div>
            <div className="avatar">
              <div className="rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <Blockie scale={5} address={proposalData.to as string} />
              </div>
            </div>

            <div className="text-sm font-bold xl:text-lg ">
              {proposalData.to?.slice(0, 4)}...{proposalData.to?.slice(38)}
            </div>
          </div>

          {/* sign status */}
          <div className="flex items-center justify-between w-full my-2 ">
            <progress
              className="w-[70%] xl:w-[80%]  progress progress-secondary"
              value={(100 / Number(proposalData?.signatureRequired)) * proposalData?.signatures.length}
              max="100"></progress>
            <span className="font-bold text-right xl:w-[20%]">
              {proposalData.signatures.length}/ {proposalData.signatureRequired} sign
            </span>
          </div>

          {/* acion button */}
          <div
            className={
              isExecutable
                ? 'items-center justify-around my-2 card-actions '
                : 'items-center justify-between my-2 card-actions'
            }>
            {isExecutable && (
              <>
                <button className=" btn btn-error" onClick={async (): Promise<void> => onExecute(true)}>
                  Discard
                </button>

                <button className=" btn btn-primary" onClick={async (): Promise<void> => onExecute(false)}>
                  Execute
                </button>
              </>
            )}

            {!isExecutable && (
              <>
                <div className="font-bold text-gray-400 ">{proposalData.createdAt}</div>
                {isExecuted && (
                  <div>
                    {proposalData.isDiscarded ? (
                      <span className="font-bold text-orange-400 ">Discarded</span>
                    ) : (
                      <span className="font-bold text-green-400 ">Executed</span>
                    )}
                  </div>
                )}
                <input
                  type="checkbox"
                  checked={signCheck}
                  onChange={(): any => null}
                  onClick={onSign}
                  className="checkbox checkbox-primary checkbox-lg"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProposalSignCard);
