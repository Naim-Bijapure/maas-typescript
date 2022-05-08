import { LogoutOutlined as LogoutIcon, LoginOutlined as LoginIcon } from '@ant-design/icons';
import { getNetwork, Networkish } from '@ethersproject/networks';
import { Address, Balance, Blockie } from 'eth-components/ant';
import { useGasPrice } from 'eth-hooks';
import {
  useEthersAppContext,
  connectorErrorText,
  NoStaticJsonRPCProviderFoundError,
  CouldNotActivateError,
  UserClosedModalError,
  TEthersModalConnector,
} from 'eth-hooks/context';
import React, { FC, ReactNode, useCallback } from 'react';

import { useAntNotification } from '~~/components/main/hooks/useAntNotification';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { getNetworkInfo } from '~~/functions';

// displays a page header
export interface IMainPageHeaderProps {
  scaffoldAppProviders: IScaffoldAppProviders;
  price: number;
  children?: ReactNode;
}

/**
 * ✏ Header: Edit the header and change the title to your project name.  Your account is on the right *
 * @param props
 * @returns
 */
export const MainPageHeader: FC<IMainPageHeaderProps> = (props) => {
  const ethersAppContext = useEthersAppContext();
  const selectedChainId = ethersAppContext.chainId;

  const notification = useAntNotification();

  // 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation
  const [gasPrice] = useGasPrice(ethersAppContext.chainId, 'fast', getNetworkInfo(ethersAppContext.chainId));

  const onLoginError = useCallback(
    (e: Error) => {
      if (e instanceof UserClosedModalError) {
        notification.info({
          message: connectorErrorText.UserClosedModalError,
          description: e.message,
        });
      } else if (e instanceof NoStaticJsonRPCProviderFoundError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.NoStaticJsonRPCProviderFoundError,
          description: e.message,
        });
      } else if (e instanceof CouldNotActivateError) {
        notification.error({
          message: 'Login Error: ' + connectorErrorText.CouldNotActivateError,
          description: e.message,
        });
      } else {
        notification.error({ message: 'Login Error: ', description: e.message });
      }
    },
    [notification]
  );

  const ProfileSection: ReactNode = (
    <>
      <div className={ethersAppContext.active ? 'flex-none' : 'hidden'}>
        <div className="n-balance">
          <Balance price={props.price} address={ethersAppContext.account as string} />
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Blockie scale={10} address={ethersAppContext.account as string} />
            </div>
          </label>
          <ul tabIndex={0} className="w-56 p-0 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box">
            <li>
              <div className="n-address">
                <Address address={ethersAppContext.account} />
              </div>
            </li>
            <li className="">
              <a
                onClick={(): void => {
                  ethersAppContext.disconnectModal();
                }}>
                logout
                <LogoutIcon title="logout" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );

  const Login: ReactNode = (
    <>
      <div className={!ethersAppContext.active ? 'flex-none' : 'hidden'}>
        <div className="mx-3 text-3xl">
          <LoginIcon
            onClick={(): void => {
              // console.log('ethersAppContext.active: ', ethersAppContext.active);
              const connector = props.scaffoldAppProviders.createLoginConnector?.();
              ethersAppContext.openModal(connector as TEthersModalConnector, onLoginError);
            }}
          />
        </div>
      </div>
    </>
  );
  const WrongNetwork: ReactNode = (
    <>
      <div
        className={
          selectedChainId && selectedChainId !== props.scaffoldAppProviders.targetNetwork.chainId
            ? 'alert alert-warning shadow-lg ml-auto my-2 w-1/2'
            : 'hidden'
        }>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 w-6 h-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            You have <b>{getNetwork(selectedChainId as Networkish)?.name}</b> selected and you need to be on{' '}
            <b>{getNetwork(props.scaffoldAppProviders.targetNetwork)?.name ?? 'UNKNOWN'}</b>.
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="shadow-md navbar bg-base-100">
        <div className="flex-1">
          <a className="text-xl normal-case btn btn-ghost" href="/">
            MultiSig
          </a>
        </div>
        {ProfileSection}
        {Login}
      </div>
      {WrongNetwork}
    </>
  );
};
