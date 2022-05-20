import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { TNetworkNames } from '@scaffold-eth/common/src/models/TNetworkNames';
import { IEthComponentsSettings } from 'eth-components/models';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { invariant } from 'ts-invariant';

export const DEBUG = true;
invariant.log('MODE', import.meta.env.MODE, import.meta.env.DEV);
/** ******************************
 * TARGET NETWORK CONFIG: 📡 What chain are your contracts deployed to?
 ****************************** */

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */
const DEFAULT_TARGET_NETWORK = import.meta.env.VITE_APP_TARGET_NETWORK;

const cachedNetwork = window.localStorage.getItem('network') || DEFAULT_TARGET_NETWORK;
// console.log('cachedNetwork: ', cachedNetwork);

export const targetNetwork: TNetworkNames = cachedNetwork as TNetworkNames;

// const targetNetwork: TNetworkNames = import.meta.env.VITE_APP_TARGET_NETWORK as TNetworkNames;
// invariant.log('VITE_APP_TARGET_NETWORK', import.meta.env.VITE_APP_TARGET_NETWORK);
invariant(NETWORKS[targetNetwork] != null, `Invalid target network: ${targetNetwork}`);

export const TARGET_NETWORK_INFO: TNetworkInfo = NETWORKS[targetNetwork];
if (DEBUG) console.log(`📡 Connecting to ${TARGET_NETWORK_INFO.name}`);

/** ******************************
 * APP CONFIG:
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED = import.meta.env.VITE_FAUCET_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Use burner wallet as fallback
 */
export const BURNER_FALLBACK_ENABLED = import.meta.env.VITE_BURNER_FALLBACK_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_AUTOMATICALLY =
  import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY === 'true' && import.meta.env.DEV;

if (DEBUG)
  invariant.log(
    `import.meta.env.DEV: ${import.meta.env.DEV}`,
    `import.meta.env.VITE_FAUCET_ALLOWED: ${import.meta.env.VITE_FAUCET_ALLOWED}`,
    `import.meta.env.VITE_BURNER_FALLBACK_ALLOWED: ${import.meta.env.VITE_BURNER_FALLBACK_ALLOWED}`,
    `import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY: ${import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY}`
  );

if (DEBUG)
  invariant.log(
    `FAUCET_ENABLED: ${FAUCET_ENABLED}`,
    `BURNER_FALLBACK_ENABLED: ${BURNER_FALLBACK_ENABLED}`,
    `CONNECT_TO_BURNER_AUTOMATICALLY: ${CONNECT_TO_BURNER_AUTOMATICALLY}`
  );

export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

/** ******************************
 * OTHER FILES
 ****************************** */

/**
 * See web3ModalConfig.ts to setup your wallet connectors
 */

/**
 * See appContractsConfig.ts for your contract configuration
 */

/**
 * see apiKeysConfig.ts for your api keys
 */

/** ******************************
 * PROVIDERS CONFIG
 ****************************** */

// -------------------
// Connecting to mainnet
// -------------------
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider(import.meta.env.VITE_RPC_MAINNET);
const mainnetInfura = new StaticJsonRpcProvider(
  `${import.meta.env.VITE_RPC_MAINNET_INFURA}/${import.meta.env.VITE_KEY_INFURA}`
);
// const mainnetProvider = new InfuraProvider("mainnet",import.meta.env.VITE_KEY_INFURA);

// 🚊 your mainnet provider
export const MAINNET_PROVIDER = mainnetScaffoldEthProvider;

// -------------------
// connecting to local provider
// -------------------

if (DEBUG) console.log('🏠 Connecting to provider:', NETWORKS.localhost.url);
export const LOCAL_PROVIDER: TEthersProvider | undefined =
  TARGET_NETWORK_INFO === NETWORKS.localhost && import.meta.env.DEV
    ? new StaticJsonRpcProvider(NETWORKS.localhost.url)
    : undefined;

// create eth components context for options and API keys

export const BLOCKNATIVE_DAPPID = import.meta.env.VITE_KEY_BLOCKNATIVE_DAPPID;
export const ethComponentsSettings: IEthComponentsSettings = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

// export const BASE_URL = 'http://localhost:4000/api';

export const BASE_URL = 'https://maas-backend.herokuapp.com/api';
// export const BASE_URL =
//   targetNetwork === 'localhost' ? 'http://localhost:4000/api' : 'https://maas-backend.herokuapp.com/api';

console.log('BASE_URL: ', BASE_URL);
