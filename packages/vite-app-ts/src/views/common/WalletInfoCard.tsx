import { PlusCircleOutlined as AddProposalIcon } from '@ant-design/icons';
import { PunkBlockie, Balance, Address } from 'eth-components/ant';
import React from 'react';
import { Link } from 'react-router-dom';

interface IWalletInfoCard {
  isManageWalletScreen: boolean;
}
const WalletInfoCard: React.FC<IWalletInfoCard> = ({ isManageWalletScreen }) => {
  return (
    <>
      {isManageWalletScreen && (
        <>
          <div className=" xl:w-[30%] xl:m-5">
            <div className="flex w-full mt-5 shadow-2xl xl:w-[100%] card bg-base-100 glass ">
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
          </div>
        </>
      )}

      {!isManageWalletScreen && (
        <>
          <div className="xl:flex">
            <div className="flex w-full mt-2 shadow-2xl card bg-base-100 xl:card-side glass ">
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
        </>
      )}
    </>
  );
};
export default WalletInfoCard;
