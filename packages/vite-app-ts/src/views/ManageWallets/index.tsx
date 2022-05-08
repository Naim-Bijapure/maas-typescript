import { PunkBlockie, Address, Balance } from 'eth-components/ant';
import { useEthersAppContext } from 'eth-hooks/context';
import React, { ReactNode } from 'react';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { Link } from 'react-router-dom';

interface IContractList {
  scaffoldAppProviders: IScaffoldAppProviders;
}

const wallet: ReactNode = (
  <>
    <div className="h-full m-2 shadow-xl card card-compact bg-base-100 lg:w-[30%] sm:w-[100%] glass">
      <figure className="h-48 scale-50 ">
        {/* <img src="https://api.lorem.space/image/car?w=400&h=225" alt="car!" /> */}
        <PunkBlockie withQr={true} scale={1} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
      </figure>
      <div className="card-body ">
        <h2 className="flex flex-col items-start card-title n-address md:flex md:flex-row md:items-center">
          <Address address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
          <Balance price={1000} address="0x813f45BD0B48a334A3cc06bCEf1c44AAd907b8c1" />
        </h2>
        <p>
          <div>4 owners</div>
          <div>2 signature requred</div>
        </p>
        <div className="justify-end card-actions">
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
    <div className="m-10">
      <div className="flex flex-col-reverse justify-between lg:flex lg:flex-row lg:justify-between">
        <span className="text-5xl font-bold ">Your wallets</span>
        <button className="m-2 btn btn-primary">Create Wallet</button>
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
