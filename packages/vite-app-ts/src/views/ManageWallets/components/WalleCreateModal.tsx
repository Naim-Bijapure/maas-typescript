/* eslint-disable @typescript-eslint/no-misused-promises */
import { DeleteFilled, LoadingOutlined, PlusCircleTwoTone as AddIcon } from '@ant-design/icons';
import { Modal, InputNumber, Input, Spin } from 'antd';
import { Address, AddressInput, EtherInput } from 'eth-components/ant';
import React, { useEffect, useState } from 'react';

import { IContractData } from '~~/models/Types';

const SpinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface IWalletCreateModal {
  openModal: boolean;
  deployType?: string;
  onSubmit: (
    walletName: string,
    addressList: Array<string>,
    signatureCount: number,
    fundAmount: string
  ) => Promise<void>;
  onClose: (arg: any) => void;
  provider: any;
  price: number;
  currentAccount: string;
  isFactoryLoaded: boolean;
  reDeployData: IContractData;
}
const WalletCreateModal: React.FC<IWalletCreateModal> = ({
  openModal,
  onSubmit,
  onClose,
  provider,
  price,
  currentAccount,
  deployType,
  isFactoryLoaded,
  reDeployData,
}) => {
  const [currentAddress, setAddress] = useState<string>('');
  const [addressList, setAddressList] = useState<Array<string>>([]);
  const [signatureCount, setSignatureCount] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('0');
  const [walletName, setWalletName] = useState<string>('');
  const [toggleLoading, setToggleLoading] = useState<boolean>(false);

  const addMultipleAddress = (value: string): void => {
    // add basic validation a address should contains 0x with length of 42 chars
    const validateAddress = (address: string): any =>
      address.includes('0x') || address.length === 42 || address.includes('eth');

    const addresses = value.trim().split(',');
    let uniqueAddresses = [...new Set([...addresses])];

    uniqueAddresses = uniqueAddresses.filter(validateAddress);

    const finalUniqueAddresses = [...new Set([...addressList.filter(validateAddress), ...uniqueAddresses])];
    setAddressList(finalUniqueAddresses);
  };

  const onAddAddress = (): any => {
    if (currentAddress.length === 42) {
      const list = new Set([...addressList, currentAddress]);
      setAddressList([...list]);
      setAddress('');
    } else {
      // on multiple address inputs
      addMultipleAddress(currentAddress);
      setAddress('');
    }
  };

  const onRemoveAddress = (address: string): void => {
    const list = addressList.filter((value) => value !== address);
    setAddressList([...list]);
  };
  useEffect(() => {
    if (openModal === false) {
    }
  }, [openModal]);

  const onCreateContract = async (): Promise<void> => {
    setToggleLoading(true);
    await onSubmit(walletName, addressList, signatureCount as number, fundAmount);
    setToggleLoading(false);
  };

  useEffect(() => {
    setAddress(currentAccount);
  }, [isFactoryLoaded]);

  useEffect(() => {
    if (reDeployData) {
      setWalletName(reDeployData['walletName']);
      setAddressList([...new Set(reDeployData['owners'])]);
      setSignatureCount(reDeployData['signaturesRequired']);
    }
  }, [reDeployData, deployType]);

  /** ----------------------
   * reset data on close
   * ---------------------*/
  useEffect(() => {
    if (openModal === false) {
      setWalletName('');
      setAddressList([]);
      setSignatureCount(null);
    }
  }, [openModal]);

  return (
    <div>
      <Modal
        title="Create new wallet"
        visible={openModal}
        onCancel={onClose}
        closable={false}
        maskClosable={false}
        destroyOnClose={true}
        footer={[
          <button key="back" className="mx-5 btn btn-ghost" onClick={onClose} disabled={toggleLoading}>
            Return
          </button>,
          <button
            className="btn btn-primary"
            key={'submit'}
            //     type="primary"
            onClick={async (): Promise<void> => onCreateContract()}
            disabled={
              addressList.length === 0 || signatureCount === null || signatureCount <= addressList.length === false
            }>
            <Spin
              indicator={SpinIcon}
              style={{ color: 'purple', marginRight: '10px' }}
              spinning={toggleLoading}
              key={'createWallet'}
            />
            Submit
          </button>,
        ]}>
        {/* action header */}

        <div className="m-3 w-[87%]">
          <Input
            placeholder="Enter wallet name"
            value={walletName}
            onChange={(event): void => setWalletName(event.target.value)}
            disabled={deployType === 'Redeploy'}
          />
        </div>
        <div className="flex items-center justify-between w-full ">
          <div className="w-full m-3">
            <AddressInput
              placeholder="Enter unique owner address"
              address={currentAddress}
              onChange={setAddress}
              ensProvider={provider}
            />
          </div>
          <div className="m-1">
            <AddIcon className="text-xl" onClick={onAddAddress}>
              Add{' '}
            </AddIcon>
          </div>
        </div>

        {/* display address list */}
        <div className="m-2">
          {addressList.map((address: string) => {
            return (
              <div key={address} className="flex justify-center items--center">
                <Address address={address} fontSize={20} />
                <DeleteFilled
                  className="text-xl"
                  color="red"
                  style={{ color: 'red' }}
                  onClick={(): void => onRemoveAddress(address)}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full  m-3">
          <InputNumber
            style={{ width: '200px' }}
            placeholder="signature count"
            min={1}
            onChange={setSignatureCount}
            value={signatureCount as number}
          />
        </div>

        <div className="w-full m-3">
          <EtherInput value={fundAmount} price={price} placeholder="fund wallet (optional)" onChange={setFundAmount} />
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(WalletCreateModal);
