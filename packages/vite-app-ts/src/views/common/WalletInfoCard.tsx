import { PlusCircleOutlined as AddProposalIcon } from '@ant-design/icons';
import { PunkBlockie, Balance, Address } from 'eth-components/ant';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ProposalModal from '../ManageWallets/components/ProposalModal';

import { IContractData } from '~~/models/Types';

interface IWalletInfoCard {
  isManageWalletScreen: boolean;
  // contractId: number;
  contractDetails: IContractData;
  updateContractList?: () => Promise<void>;
}
const WalletInfoCard: React.FC<IWalletInfoCard> = ({ isManageWalletScreen, contractDetails, updateContractList: fetchAllContract }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [onDelayClose, setOnDelayClose] = useState<boolean>(false);
  // const [state, dispatch] = useStore();
  // const contractDetails = state.contracts?.find((data) => Number(data['contractId']) === Number(contractId));
  // console.log('contractDetails: ', contractDetails);

  const onOpen = (): void => {
    setOnDelayClose(true);
    setOpenModal(true);
  };
  const onClose = async (): Promise<void> => {
    setOpenModal(false);
    // TO  UNMOUNT MODAL WITH TRANSITION CLOSE ANIMATION
    setTimeout(() => {
      setOnDelayClose(false);
    }, 100);

    if (typeof fetchAllContract === 'function') {
      await fetchAllContract();
    }
  };

  return (
    <>
      {/* IF THE SCREEN IS MAIN MANAGE WALLET SCREEN */}
      {isManageWalletScreen && (
        <>
          <div className=" xl:w-[30%] xl:m-5">
            <div className="flex w-full mt-5 shadow-2xl xl:w-[100%] card bg-base-100 glass ">
              {/* qr */}
              <figure className="">
                <div className="h-[200px] scale-50">
                  <PunkBlockie withQr={true} scale={0} address={contractDetails?.contractAddress} />
                </div>
              </figure>

              <div className="items-center text-center card-body n--red ">
                <div className="card-title n-balance-lg  xl:mt-4">
                  <Balance price={1000} address={contractDetails?.contractAddress} />
                </div>
                <div className="card-title n-balance-lg  xl:mt-0">{contractDetails?.walletName}</div>

                <div className=" text-left">
                  <div className="n-address">
                    <Address address={contractDetails?.contractAddress} />
                  </div>
                  <div className="font-bold text-md ">{contractDetails?.owners.length} owner</div>
                  <div className="font-bold text-md ">{contractDetails?.signaturesRequired} signature required</div>
                </div>
                <div className=" items-center justify-between  w-full xl:ml-auto card-actions">
                  <div className="font-bold text-gray-400 ">{contractDetails?.createdAt}</div>
                  <Link to={`/wallet/${contractDetails?.contractId}`}>
                    <button className="btn btn-secondary">Open</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* IF THE SCREEN IS VIEW WALLET SCREEN */}
      {!isManageWalletScreen && (
        <>
          {onDelayClose && (
            <ProposalModal
              contractId={contractDetails.contractId}
              openModal={openModal}
              onClose={onClose}
              onSubmit={onClose}
            />
          )}
          <div className="xl:flex">
            <div className="flex w-full mt-2 shadow-2xl card bg-base-100 xl:card-side glass ">
              {/* qr */}
              <figure className="">
                <div className="h-[200px] scale-50 xl:scale-75 xl:h-full ">
                  <PunkBlockie withQr={true} scale={0} address={contractDetails?.contractAddress} />
                </div>
              </figure>

              <div className="items-center text-center card-body n--red xl:items-start xl:justify-between">
                <div className="card-title n-balance-lg  xl:mt-4">
                  <Balance price={1000} address={contractDetails?.contractAddress} />
                </div>
                <div className="mr-auto text-left">
                  <div className="n-address">
                    <Address address={contractDetails?.contractAddress} />
                  </div>
                  <div className="font-bold text-md ">{contractDetails?.owners.length} owners</div>
                  <div className="font-bold text-md ">{contractDetails?.signaturesRequired} signature required</div>
                </div>
                <div className="card-actions xl:mb-4">
                  <button className="btn btn-secondary" onClick={onOpen}>
                    <span className="mx-2">Add Proposal</span>
                    <AddProposalIcon className="" style={{ fontSize: '20px', marginBottom: '3px' }} />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full mt-4 shadow-2xl card bg-base-300 xl:mx-5 xl:mt-2 xl:w-[30%]">
              <div className="card-body">
                <h2 className="card-title">Owners</h2>
                {contractDetails?.owners.map((address) => {
                  return (
                    <div className="n-address" key={address}>
                      <Address address={address} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default React.memo(WalletInfoCard);
