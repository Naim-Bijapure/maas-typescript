/* eslint-disable @typescript-eslint/no-misused-promises */
import { LoadingOutlined } from '@ant-design/icons';
import { parseEther } from '@ethersproject/units';
import { Input, InputNumber, Modal, notification, Select, Spin } from 'antd';
import { AddressInput, EtherInput } from 'eth-components/ant';
import { BytesLike } from 'ethers';
import React, { useEffect, useState } from 'react';

import API from '~~/config/API';
import { MAINNET_PROVIDER } from '~~/config/app.config';
import { IProposal } from '~~/models/Types';
import { useStore } from '~~/store/useStore';

const { Option } = Select;

interface IProposeTranscaction {
  openModal: boolean;
  contractId: number;
  onSubmit: () => void;
  onClose: (arg: any) => void;
}
const SpinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ProposeModal: React.FC<IProposeTranscaction> = ({ openModal, onClose, onSubmit, contractId }) => {
  const [state] = useStore();
  const { ethersAppContext, ethPrice, contracts, multiSigWallet } = state;
  const contractDetails = contracts?.find((data) => Number(data['contractId']) === Number(contractId));

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [currentCallData, setCurrentCallData] = useState<any>(null);
  const [value, setValue] = useState<string>('');
  const [newSignatureCount, setNewSignatureCount] = useState<number | undefined>(undefined);
  const [toggleLoading, setToggleLoading] = useState<boolean>(false);

  const onActionSelect = (value: string): void => {
    setSelectedAction(value);
    setValue('');
    setToAddress('');
    setCurrentCallData(null);
    setNewSignatureCount(contractDetails?.signaturesRequired);
  };

  const onProposalCreate = async (): Promise<void> => {
    setToggleLoading(true);
    const etherValue = value ? parseEther(value) : 0;

    const multiSigWalletLoaded = multiSigWallet?.attach(contractDetails?.contractAddress as string);

    const proposalId = Number(contractDetails?.proposals?.length) + 1;

    const nonce = proposalId - 1;
    const signatureRequired = await multiSigWalletLoaded?.signaturesRequired();

    const walletAddress = multiSigWalletLoaded?.address;

    let updatedOwnerList: string[] = [...(contractDetails?.owners as string[])];
    if (selectedAction === 'addSigner') {
      updatedOwnerList = [...new Set([...updatedOwnerList, toAddress])];
    }

    if (selectedAction === 'removeSigner') {
      updatedOwnerList = [...updatedOwnerList].filter((address) => address !== toAddress);
    }

    const currentToAddress = currentCallData === '0x' ? toAddress : walletAddress;

    const hash = await multiSigWalletLoaded?.getTransactionHash(
      nonce,
      currentToAddress as string,
      etherValue.toString(),
      currentCallData as BytesLike
    );

    const discardHash = await multiSigWalletLoaded?.getTransactionHash(nonce, currentToAddress as string, '0', '0x');

    // created a proposal data
    const proposalData: IProposal = {
      proposalId,
      nonce: nonce,
      chainId: ethersAppContext?.chainId as number,
      eventName: selectedAction,
      contractAddress: walletAddress,
      from: contractDetails?.account,
      to: currentToAddress,
      callData: currentCallData,
      value: etherValue.toString(),
      newSignatureCount: newSignatureCount as number,
      hash,
      discardHash,
      signatureRequired: signatureRequired?.toNumber(),
      signatures: [],
      discardSignatures: [],
      owners: contractDetails?.owners,
      updatedOwnerList,
      isExecuted: false,
      isDiscarded: false,
    };

    const reqData = {
      contractId,
      proposalData,
    };

    const addProposalResponse = await API.post(`/proposalAdd`, reqData);
    console.log('addProposalResponse: ', addProposalResponse);

    notification['success']({ message: 'Proposal created' });
    onSubmit();

    setToggleLoading(false);
  };

  useEffect(() => {
    if (selectedAction === 'transferFunds') {
      const callData = '0x';
      setCurrentCallData(callData);
    }

    if (['addSigner', 'removeSigner'].includes(selectedAction)) {
      if (Boolean(toAddress) && (newSignatureCount as number) > 0) {
        // @ts-ignore
        const callData = state.multiSigWallet?.interface.encodeFunctionData(selectedAction, [
          toAddress,
          newSignatureCount,
        ]);

        setCurrentCallData(callData);
      }
    }
  }, [selectedAction, newSignatureCount]);

  return (
    <Modal
      title="Create new proposal"
      closable={false}
      visible={openModal}
      // onOk={onSubmit}
      // onCancel={onClose}
      // footer action buttons
      footer={[
        <button key="back" onClick={onClose} className="mx-4 btn btn-ghost" disabled={toggleLoading}>
          Return
        </button>,
        <button
          key={selectedAction}
          className="btn btn-primary"
          onClick={async (): Promise<void> => onProposalCreate()}
          disabled={toAddress.length === 0 || toggleLoading}>
          <Spin
            indicator={SpinIcon}
            style={{ color: 'purple', marginRight: '10px' }}
            spinning={toggleLoading}
            key={selectedAction}
          />
          Submit
        </button>,
      ]}>
      <div className="flex flex-col  items-center w-full">
        {/* select action */}
        <div className="m-2 w-[70%]">
          <Select placeholder="select action" className="w-full" onChange={onActionSelect}>
            <Option value="transferFunds">Transfer funds</Option>
            <Option value="addSigner">Add Signer</Option>
            <Option value="removeSigner">Remove Signer</Option>
            <Option value="customCall">Custom Call Data</Option>
          </Select>
        </div>

        {/* add address */}
        <div className="m-2 w-[70%]" key={selectedAction}>
          <span className="text-gray-400">
            Enter {selectedAction === 'transferFunds' ? 'receipent' : 'owner'} address
          </span>
          <AddressInput
            key={selectedAction}
            address={toAddress}
            ensProvider={MAINNET_PROVIDER}
            placeholder={'Enter  address'}
            onChange={setToAddress}
          />

          {Boolean(toAddress) && toAddress?.includes('0x') === false && toAddress?.includes('eth') === false && (
            <div className="my-1 text-red-600">invalid address</div>
          )}
        </div>

        <div className={`m-2 w-[70%] ${['customCall'].includes(selectedAction) ? '' : 'hidden'}`}>
          <Input placeholder="Custom call data" onChange={(e): void => setCurrentCallData(e.target.value)} />
          {Boolean(currentCallData) && currentCallData?.includes('0x') === false && (
            <div className="my-1 text-red-600">custom call data is invalid</div>
          )}
        </div>

        {/* eth input  */}
        <div className={`m-2 w-[70%] ${['transferFunds', 'customCall'].includes(selectedAction) ? '' : 'hidden'}`}>
          <EtherInput
            price={ethPrice}
            key={selectedAction}
            value={value}
            placeholder="Enter amount"
            onChange={(value: string): void => setValue(Number(value).toFixed(5))}
          />
        </div>

        <div className={`m-2 w-[70%] ${['addSigner', 'removeSigner'].includes(selectedAction) ? '' : 'hidden'}`}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="New # of signer required"
            value={newSignatureCount}
            // min={1}
            onChange={setNewSignatureCount}
          />
        </div>
      </div>
    </Modal>
  );
};
export default React.memo(ProposeModal);
