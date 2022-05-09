import { AppstoreAddOutlined as AddWalletIcon } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { PunkBlockie, Address, Balance } from 'eth-components/ant';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';

interface IContractList {
  scaffoldAppProviders: IScaffoldAppProviders;
}

const wallet: ReactNode = (
  <>
    <div className="flex w-full mt-5 shadow-2xl card bg-base-300  glass xl:w-[30%] sm:w-[100%] ">
      {/* qr */}
      <figure className="">
        <div className="h-[200px] scale-50">
          <PunkBlockie withQr={true} scale={0} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
        </div>
      </figure>

      <div className="items-center text-center card-body n--red ">
        <div className="card-title n-balance-lg  xl:mt-4">
          <Balance price={1000} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
        </div>
        <div className="card-title n-balance-lg  xl:mt-0">Test wallet</div>

        <div className=" text-left">
          <div className="n-address">
            <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          </div>
          <div className="font-bold text-md ">4 owners</div>
          <div className="font-bold text-md ">4 signature required</div>
        </div>
        <div className=" items-center justify-between  w-full xl:ml-auto card-actions">
          <div className="font-bold text-gray-400 ">10/04/2022 10:10:10</div>
          <Link to={'/wallet/asasfasdf'}>
            <button className="btn btn-secondary">Open</button>
          </Link>
        </div>
      </div>
    </div>
  </>
);
const Index: React.FC<IContractList> = ({ scaffoldAppProviders }) => {
  const ethersAppContext = useEthersAppContext();
  const tempArr = [1, 2, 3, 4, 5, 6];
  return (
    <div className="m-5">
      <div className="flex  items-center justify-around xl:flex xl:flex-row xl:justify-between ">
        <div className="text-3xl font-bold  xl:text-5xl ">Your wallets</div>
        <div>
          <Tooltip title="Create wallet" placement="bottom">
            <AddWalletIcon className="text-4xl xl:mr-4" />
          </Tooltip>
        </div>
        {/* <button className="btn btn-primary w-[30%] ">
        </button> */}
      </div>
      <div className="flex flex-wrap justify-between">
        {tempArr.map((index) => {
          return <>{wallet}</>;
        })}
      </div>
    </div>
  );
};
export default Index;
