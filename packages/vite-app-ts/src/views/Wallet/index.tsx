import { InfoCircleOutlined as InfoIcon, ArrowRightOutlined as ArrowRightIcon } from '@ant-design/icons';
import { Descriptions, Tabs } from 'antd';
import { Address, Balance, Blockie } from 'eth-components/ant';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import WalletInfoCard from '../common/WalletInfoCard';
const { TabPane } = Tabs;

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

const ProposalSignCard: React.FC<{ isExecutable: boolean }> = ({ isExecutable }) => {
  const [check, setCheck] = useState(false);

  return (
    <div className="w-full xl:w-full ">
      <div
        className={
          isExecutable
            ? 'w-full  shadow-xl card bg-base-100  border-accent border-4'
            : 'w-full  shadow-xl card bg-base-300'
        }>
        <div className="text-left card-body">
          {/* heading */}
          <h2 className="flex justify-between card-title ">
            <div>Transfer Eth</div>
            <ProposalInfoModal />
          </h2>
          {/* content */}

          {/* value */}
          <div className=" text-3xl font-bold">$11111</div>
          {/* to from */}
          <div className="flex items-center justify-between my-5">
            <div className="avatar">
              <div className=" rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <Blockie scale={5} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
              </div>
            </div>
            <div className="">0x6179</div>

            <div>
              <ArrowRightIcon />
            </div>

            <div className="avatar">
              <div className="rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <Blockie scale={5} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
              </div>
            </div>
            <div className="">0x6199</div>
          </div>

          {/* sign status */}
          <div className="flex items-center justify-between w-full my-2 ">
            <progress className="w-[70%] xl:w-[80%]  progress progress-secondary" value="50" max="100"></progress>
            <span className="font-bold text-right xl:w-[20%]">1/2 sign</span>
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
                <button className=" btn btn-error">Discard</button>

                <button className=" btn btn-primary">Execute</button>
              </>
            )}

            {!isExecutable && (
              <>
                <div className="font-bold text-gray-400 ">10/04/2022 10:10:10</div>
                <input
                  type="checkbox"
                  checked={check}
                  onClick={(e): void => setCheck(!check)}
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

function callback(key: any): void {
  console.log(key);
}

// const WalletInfoCard: React.FC<any> = () => {
//   return (
//     <div className="xl:flex ">
//       <div className="flex w-full mt-2 shadow-2xl card bg-base-100 xl:card-side glass ">
//         {/* qr */}
//         <figure className="">
//           <div className="h-[200px] scale-50 xl:scale-75 xl:h-full ">
//             <PunkBlockie withQr={true} scale={0} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//           </div>
//         </figure>

//         <div className="items-center text-center card-body n--red xl:items-start xl:justify-between">
//           <div className="card-title n-balance-lg  xl:mt-4">
//             <Balance price={1000} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//           </div>
//           <div className="mr-auto text-left">
//             <div className="n-address">
//               <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//             </div>
//             <div className="font-bold text-md ">4 owners</div>
//             <div className="font-bold text-md ">4 signature required</div>
//           </div>
//           <div className="card-actions xl:mb-4">
//             <button className="btn btn-secondary">
//               <span className="mx-2">Add Proposal</span>
//               <AddProposalIcon className="" style={{ fontSize: '20px', marginBottom: '3px' }} />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="w-full mt-4 shadow-2xl card bg-base-300 xl:mx-5 xl:mt-2 xl:w-[30%]">
//         <div className="card-body">
//           <h2 className="card-title">Owners</h2>

//           <div className="n-address">
//             <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//           </div>

//           <div className="n-address">
//             <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//           </div>

//           <div className="n-address">
//             <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const Index: React.FC = () => {
  const params = useParams();
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className="m-5">
      <Tabs defaultActiveKey="1" centered onChange={callback} size={'large'} type="card">
        <TabPane tab="Wallet" key="1">
          <WalletInfoCard contractId={0} isManageWalletScreen={false} />
        </TabPane>
        <TabPane tab="Transcaction pool" key="2">
          <div className="flex flex-col items-center justify-center ">
            <div className="w-full  xl:w-[50%] ">
              <ProposalSignCard isExecutable />
            </div>
          </div>
          <div className="text-2xl font-bold divider">Sign pool</div>

          <div className="flex flex-wrap justify-center ">
            {arr.map((index) => {
              return (
                <div key={index} className="w-full mt-2 xl:w-[40%] xl:m-2">
                  <ProposalSignCard isExecutable={false} />
                </div>
              );
            })}
          </div>
        </TabPane>

        <TabPane tab="Executed proposals" key="3">
          Executed proposals
        </TabPane>
      </Tabs>
      {/* <div className="flex items-center justify-center m-5 text-center border-">
        <ProposalSignCard />
      </div> */}
    </div>
  );
};
export default Index;
