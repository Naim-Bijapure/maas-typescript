import { FileExclamationOutlined } from '@ant-design/icons';
import React from 'react';

import ProposalSignCard from './ProposalSignCard';

import { IContractData, IProposal } from '~~/models/Types';

interface IExecutedPool {
  contractDetails: IContractData;
  price: number;
}

const ExecutedPool: React.FC<IExecutedPool> = ({ contractDetails, price }) => {
  const proposals: IProposal[] = contractDetails.proposals as IProposal[];

  return (
    <>
      {/* display executed proposals */}
      <div className="flex flex-wrap justify-center  ">
        {proposals
          .filter((data) => data.isExecuted === true)
          .sort((dataA, dataB) => dataB.proposalId - dataA.proposalId)
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

        {/* if no executed proposals data */}
        {proposals.filter((data) => data.isExecuted === true).length === 0 && (
          <>
            <div className=" flex flex-wrap items-center justify-center   mt-[70%] md:mt-[20%]">
              <div className=" text-5xl  ">
                <FileExclamationOutlined />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(ExecutedPool);
