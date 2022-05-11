import '~~/styles/main-page.scss';
import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { useContractReader, useBalance, useEthersAdaptorFromProviderOrSigners, useEventListener } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useDexEthPrice } from 'eth-hooks/dapps';
import { asEthersAdaptor } from 'eth-hooks/functions';
import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import { MainPageHeader, createPagesAndTabs, TContractPageList, MainPageFooter } from './components/main';
import { useScaffoldHooksExamples as useScaffoldHooksExamples } from './components/main/hooks/useScaffoldHooksExamples';
import { useStore } from './store/useStore';
import ManageWallets from './views/ManageWallets';
import Wallet from './views/Wallet';

import { useAppContracts, useConnectAppContracts, useLoadAppContracts } from '~~/components/contractContext';
import { useCreateAntNotificationHolder } from '~~/components/main/hooks/useAntNotification';
import { useBurnerFallback } from '~~/components/main/hooks/useBurnerFallback';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { BURNER_FALLBACK_ENABLED, MAINNET_PROVIDER } from '~~/config/app.config';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See config/app.config.ts for configuration, such as TARGET_NETWORK
 * See appContracts.config.ts and externalContracts.config.ts to configure your contracts
 * See pageList variable below to configure your pages
 * See web3Modal.config.ts to configure the web3 modal
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * For more
 */

/**
 * The main component
 * @returns
 */
export const MainPage: FC = () => {
  const notificationHolder = useCreateAntNotificationHolder();
  // -----------------------------
  // Providers, signers & wallets
  // -----------------------------
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders();

  // 🦊 Get your web3 ethers context from current providers
  const ethersAppContext = useEthersAppContext();

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, BURNER_FALLBACK_ENABLED);

  // -----------------------------
  // Load Contracts
  // -----------------------------
  // 🛻 load contracts
  useLoadAppContracts();
  // 🏭 connect to contracts for mainnet network & signer
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  useConnectAppContracts(mainnetAdaptor);
  // 🏭 connec to  contracts for current network & signer
  useConnectAppContracts(asEthersAdaptor(ethersAppContext));

  // -----------------------------
  // Hooks use and examples
  // -----------------------------
  // 🎉 Console logs & More hook examples:
  // 🚦 disable this hook to stop console logs
  // 🏹🏹🏹 go here to see how to use hooks!
  useScaffoldHooksExamples(scaffoldAppProviders);

  // -----------------------------
  // These are the contracts!
  // -----------------------------

  // init contracts
  const yourContract = useAppContracts('YourContract', ethersAppContext.chainId);
  // const yourNFT = useAppContracts('YourNFT', ethersAppContext.chainId);
  const mainnetDai = useAppContracts('DAI', NETWORKS.mainnet.chainId);

  // keep track of a variable from the contract in the local React state:
  // const [purpose, update] = useContractReader(
  //   yourContract,
  //   yourContract?.purpose,
  //   [],
  //   yourContract?.filters.SetPurpose()
  // );

  // 📟 Listen for broadcast events
  // const [setPurposeEvents] = useEventListener(yourContract, 'SetPurpose', 0);

  // -----------------------------
  // .... 🎇 End of examples
  // -----------------------------
  // 💵 This hook will get the price of ETH from 🦄 Uniswap:
  const [ethPrice] = useDexEthPrice(scaffoldAppProviders.mainnetAdaptor?.provider, scaffoldAppProviders.targetNetwork);

  // 💰 this hook will get your balance
  const [yourCurrentBalance] = useBalance(ethersAppContext.account);

  const [route, setRoute] = useState<string>('');
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const multiSigFactory = useAppContracts('MultiSigFactory', ethersAppContext.chainId);
  const multiSigWallet = useAppContracts('MultiSigWallet', ethersAppContext.chainId);

  // -----------------
  //  add required data on global state
  // -----------------
  const [state, dipatch] = useStore();
  useEffect(() => {
    dipatch({ payload: { ethersAppContext, scaffoldAppProviders, ethPrice, multiSigFactory, multiSigWallet } });
  }, [ethersAppContext.account, ethPrice]);

  // -----------------------------
  // 📃 Page List
  // -----------------------------
  // This is the list of tabs and their contents
  const pageList: TContractPageList = {
    mainPage: {
      name: 'manageWallets',
      content: (
        <>
          {/* <ManageWallets scaffoldAppProviders={scaffoldAppProviders} account={ethersAppContext.account as string} /> */}
          <ManageWallets />
        </>
      ),
    },
    pages: [
      {
        name: 'wallet/:walletId',
        content: (
          <>
            <Wallet />
          </>
        ),
      },
    ],
  };
  const { tabContents, tabMenu } = createPagesAndTabs(pageList, route, setRoute);

  return (
    <div className="App">
      <MainPageHeader scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} />
      {/* Routes should be added between the <Switch> </Switch> as seen below */}
      <BrowserRouter>
        {/* {tabMenu} */}
        <Switch>{tabContents}</Switch>
      </BrowserRouter>
      {/* <MainPageFooter scaffoldAppProviders={scaffoldAppProviders} price={ethPrice} /> */}
      <div style={{ position: 'absolute' }}>{notificationHolder}</div>
    </div>
  );
};
