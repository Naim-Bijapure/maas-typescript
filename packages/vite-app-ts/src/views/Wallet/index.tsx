import { InfoCircleOutlined as InfoIcon, CheckCircleOutlined as SignIcon } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Blockie } from 'eth-components/ant';
import React from 'react';
import { useParams } from 'react-router-dom';

const { TabPane } = Tabs;

function callback(key: any): any {
  console.log(key);
}

const MyComponent: React.FC = () => (
  <div className="w-full lg:w-[50%]">
    <div className="w-full shadow-xl card bg-base--300 bg-neutral">
      <div className="text-left card-body">
        <h2 className="flex justify-between card-title">
          <div>Transfer eth</div>
          <div className="text-accent">
            <InfoIcon style={{ fontSize: '30px' }} />
          </div>
        </h2>
        <div className="flex items-center justify-start">
          <div>
            <Blockie scale={5} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>
          <div className="mx-2">0x6179</div>
        </div>
        {/* <div className="radial-progress" style={{ '--value': '90' } as React.CSSProperties}>
          1/5
        </div> */}
        <div className="flex items-center justify-between">
          <progress className="w-[60%]  progress progress-secondary" value="50" max="100"></progress>
          <span className="w-[20%]">1/2 sign</span>
          <button className="btn btn-ghost text-secondary w-[10%]">
            <SignIcon style={{ fontSize: '25px' }} />
          </button>
        </div>

        <div className="justify-end card-actions">
          <button className="btn btn-primary">Execute</button>
          <button className="btn btn-ghost">Discard</button>
        </div>
      </div>
    </div>
  </div>
);

const Index: React.FC = () => {
  const params = useParams();
  console.log('params: ', params);
  return (
    <div>
      my fun compo
      <div className="flex items-center justify-center m-5 text-center border-">
        <MyComponent />
      </div>
    </div>
  );
};
export default Index;
