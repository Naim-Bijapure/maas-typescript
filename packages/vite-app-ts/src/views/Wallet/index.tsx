import {
  InfoCircleOutlined as InfoIcon,
  CheckCircleOutlined as SignIcon,
  ArrowRightOutlined as ArrowRightIcon,
  PlusCircleOutlined as AddProposalIcon,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import { Address, Balance, Blockie, PunkBlockie } from 'eth-components/ant';
import React from 'react';
import { useParams } from 'react-router-dom';
const { TabPane } = Tabs;

const ProposalSignCard: React.FC = () => (
  <div className="w-full xl:w-[50%] ">
    <div className="w-full shadow-xl card bg-base-300   ">
      <div className="text-left card-body">
        {/* heading */}
        <h2 className="flex justify-between card-title">
          <div>Transfer Eth</div>
          <div className="text-accent">
            <InfoIcon style={{ fontSize: '30px' }} />
          </div>
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
        <div className="flex items-center justify-between my-2">
          <progress className="w-[80%]  progress progress-secondary" value="50" max="100"></progress>
          <span className="w-[20%]">1/2 sign</span>
        </div>

        {/* acion button */}
        <div className="justify-end my-2 card-actions">
          <button className=" btn btn-primary">
            <span className="mx-2">Sign</span>
            <SignIcon className="" style={{ fontSize: '20px', marginBottom: '3px' }} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

function callback(key: any): void {
  console.log(key);
}

const WalletInfo: React.FC<any> = () => {
  return (
    <div className="xl:flex ">
      <div className="flex w-full mt-2 shadow-2xl card bg-base-300 xl:card-side glass ">
        {/* qr */}
        <figure className="">
          <div className="h-[200px] scale-50 xl:scale-75 xl:h-full ">
            <PunkBlockie withQr={true} scale={0} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>
        </figure>

        <div className="items-center text-center card-body n--red xl:items-start xl:justify-between">
          <div className="card-title n-balance-lg  xl:mt-4">
            <Balance price={1000} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>
          <div className="mr-auto text-left">
            <div className="n-address">
              <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
            </div>
            <div className="font-bold text-md ">4 owners</div>
            <div className="font-bold text-md ">4 signature required</div>
          </div>
          <div className="card-actions xl:mb-4">
            <button className="btn btn-secondary">
              <span className="mx-2">Add Proposal</span>
              <AddProposalIcon className="" style={{ fontSize: '20px', marginBottom: '3px' }} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 shadow-2xl card bg-base-300 xl:mx-5 xl:mt-2 xl:w-[30%]">
        <div className="card-body">
          <h2 className="card-title">Owners</h2>

          <div className="n-address">
            <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>

          <div className="n-address">
            <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>

          <div className="n-address">
            <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const params = useParams();
  return (
    <div className="m-5">
      {/* <div className="w-full tabs tabs-boxed tab-lg">
        <a className="tab tab-active">Wallet</a>
        <a className="tab ">Transcactions pool</a>
      </div> */}
      <Tabs defaultActiveKey="1" centered onChange={callback} size={'large'} type="card">
        <TabPane tab="Wallet" key="1">
          <WalletInfo />
        </TabPane>
        <TabPane tab="Executed proposals" key="2">
          Executed proposals
        </TabPane>
        <TabPane tab="Transcaction pool" key="3">
          <ProposalSignCard />
        </TabPane>
      </Tabs>

      {/* <div className="flex items-center justify-center m-5 text-center border-">
        <ProposalSignCard />
      </div> */}
    </div>
  );
};
export default Index;
