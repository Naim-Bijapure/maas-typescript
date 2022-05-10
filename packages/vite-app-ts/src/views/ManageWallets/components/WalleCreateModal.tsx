import { DeleteFilled, PlusCircleTwoTone as AddIcon } from '@ant-design/icons';
import { Modal, InputNumber, Input } from 'antd';
import { Address, AddressInput, EtherInput } from 'eth-components/ant';
import React, { useEffect, useState } from 'react';

interface IWalletCreateModal {
  openModal: boolean;
  onSubmit: (walletName: string, addressList: Array<string>, signatureCount: number, fundAmount: string) => void;
  onClose: (arg: any) => void;
  provider: any;
  price: number;
  currentAccount: string;
}
const WalletCreateModal: React.FC<IWalletCreateModal> = ({
  openModal,
  onSubmit,
  onClose,
  provider,
  price,
  currentAccount,
}) => {
  const [currentAddress, setAddress] = useState<string>('');
  const [addressList, setAddressList] = useState<Array<string>>([]);
  const [signatureCount, setSignatureCount] = useState<number | null>(null);
  const [fundAmount, setFundAmount] = useState<string>('0');
  const [walletName, setWalletName] = useState<string>('');

  console.log('WalletCreateModal: ');

  const onAddAddress = (): any => {
    if (currentAddress.includes('eth') || currentAddress.length === 42) {
      const list = new Set([...addressList, currentAddress]);
      setAddressList([...list]);
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

  useEffect(() => {
    setAddress(currentAccount);
  }, []);

  return (
    <div>
      <Modal
        title="Create new wallet"
        visible={openModal}
        // onOk={onSubmit}
        onCancel={onClose}
        footer={[
          <button key="back" className="mx-5 btn btn-ghost" onClick={onClose}>
            Return
          </button>,
          <button
            className="btn btn-primary"
            key={'submit'}
            //     type="primary"
            onClick={(): void => onSubmit(walletName, addressList, signatureCount as number, fundAmount)}
            disabled={addressList.length === 0 || signatureCount === null}>
            Submit
          </button>,
        ]}>
        {/* action header */}

        <div className="m-3 w-[87%]">
          <Input placeholder="Enter wallet name" onChange={(event): void => setWalletName(event.target.value)} />
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
                <Address address={address} />
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
          <InputNumber style={{ width: '200px' }} placeholder="signature count" min={1} onChange={setSignatureCount} />
        </div>

        <div className="w-full m-3">
          <EtherInput value={fundAmount} price={price} placeholder="fund wallet (optional)" onChange={setFundAmount} />
        </div>
      </Modal>
    </div>
  );
};

// const checkProps = (preProps: IWalletCreateModal, nextProps: IWalletCreateModal): boolean => {
//   return preProps.openModal !== nextProps.openModal;
// };
export default React.memo(WalletCreateModal);
