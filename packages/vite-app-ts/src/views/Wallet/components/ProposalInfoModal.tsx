import { InfoCircleOutlined as InfoIcon } from '@ant-design/icons';
import { Descriptions } from 'antd';
import { Address, Balance } from 'eth-components/ant';
import React from 'react';

const ProposalInfoModal: React.FC = () => {
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

          <h3 className="text-lg font-bold">Transfer Eth</h3>
          <Descriptions
            title="Proposal details"
            bordered
            layout="vertical"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="Event Name">{'Transfer eth'}</Descriptions.Item>
            <Descriptions.Item label="Function signature">addSigner(double,double)</Descriptions.Item>
            <Descriptions.Item label="Sign hash">0x9444</Descriptions.Item>
            <Descriptions.Item label="From">
              <p className="n-address">
                <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="To">
              <p className="n-address">
                <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="Signature required">4</Descriptions.Item>
            <Descriptions.Item label="Owners">
              <p>
                {/* {data.signers.map((sign: any) => {
                  return (
                    <p key={sign} className="n-addressAdjustement">
                      <Address address={sign} />
                    </p>
                  );
                })} */}

                <p key={'1'} className="n-address">
                  <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
                </p>

                <p key={'2'} className="n-address">
                  <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
                </p>
              </p>
            </Descriptions.Item>
            <Descriptions.Item label="Signed owners">
              <p>
                {/* {data.signatures?.map(({ owner, sign }: any, index: number) => {
                  return (
                    <p key={owner} className="n-addressAdjustement">
                      <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
                    </p>
                  );
                })} */}

                <p key={'1'} className="n-address">
                  <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
                </p>

                <p key={'2'} className="n-address">
                  <Address address={'0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1'} />
                </p>
              </p>
            </Descriptions.Item>

            <Descriptions.Item label="Value">
              <p className="n-balance">
                <Balance
                  address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1"
                  // balance={'1000'}
                  // dollarMultiplier={'1000'}
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
