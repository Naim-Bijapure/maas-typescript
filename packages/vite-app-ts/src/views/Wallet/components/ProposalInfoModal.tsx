import { InfoCircleOutlined as InfoIcon } from '@ant-design/icons';
import { Descriptions } from 'antd';
import { Address, Balance } from 'eth-components/ant';
import { BigNumber } from 'ethers';
import React from 'react';

import { IProposal } from '~~/models/Types';
import { useStore } from '~~/store/useStore';

interface IProposalInfoModal {
  proposalData: IProposal;
  price: number;
}
const ProposalInfoModal: React.FC<IProposalInfoModal> = ({ proposalData, price }) => {
  const [state] = useStore();

  // get function sigature
  const functionSignature =
    proposalData.callData === '0x'
      ? proposalData.callData
      : (state.multiSigWallet?.interface.parseTransaction({
          data: proposalData.callData,
        }).signature as string);

  console.log('functionSignature: ', functionSignature);
  return (
    <>
      <label htmlFor="infoModal" className="btn btn-ghost ">
        <div className="text-accent">
          <InfoIcon style={{ fontSize: '25px' }} />
        </div>
      </label>

      <input type="checkbox" id="infoModal" className="modal-toggle " />
      <div className="modal ">
        <div className="relative max-w-5xl modal-box">
          <label htmlFor="infoModal" className="absolute btn btn-sm btn-circle right-2 top-2">
            ✕
          </label>

          <h3 className="text-lg font-bold">{proposalData.eventName}</h3>
          <Descriptions
            title="Proposal details"
            bordered
            layout="vertical"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="Event Name">{proposalData.eventName}</Descriptions.Item>
            <Descriptions.Item label="Function signature">{functionSignature}</Descriptions.Item>
            <Descriptions.Item label="Sign hash">{proposalData.hash?.slice(0, 6)}</Descriptions.Item>
            <Descriptions.Item label="From">
              <p className="">
                <Address address={proposalData.from} fontSize={15} />
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="To">
              <p className="">
                <Address address={proposalData.to} fontSize={15} />
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="Signature required">{proposalData.signatureRequired}</Descriptions.Item>
            <Descriptions.Item label="Owners">
              <p>
                {proposalData?.owners?.map((address: any) => {
                  return (
                    <p key={address} className="">
                      <Address address={address} fontSize={15} />
                    </p>
                  );
                })}
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="Signed owners">
              <p>
                {proposalData.signatures?.map(({ owner, sign }: any, index: number) => {
                  return (
                    <p key={owner} className="">
                      <Address address={owner} fontSize={15} />
                    </p>
                  );
                })}
              </p>
            </Descriptions.Item>

            <Descriptions.Item label="Value">
              <p className="">
                <Balance
                  fontSize={15}
                  address=""
                  balance={BigNumber.from(proposalData['value'] as string)}
                  dollarMultiplier={price}
                />
              </p>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProposalInfoModal);
