/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEthersAppContext } from 'eth-hooks/context';
import { formatBytes32String } from 'ethers/lib/utils';
import React, { useState } from 'react';

import { useAppContracts } from '~~/components/contractContext';

const Create2Test: React.FC = () => {
  const ethersAppContext = useEthersAppContext();
  const YourFactory = useAppContracts('YourFactory', ethersAppContext.chainId);
  const [salt, setSalt] = useState<string>();
  const [purpose, setPurpose] = useState<string>();
  return (
    <div className="flex flex-col items-center justify-center w-screen">
      <div className="flex justify-around w-1/2">
        <input
          type="text"
          className="mx-2 input bg-base-300  "
          placeholder="salt value"
          value={salt}
          onChange={(e): any => setSalt(e.target.value)}
        />
        <input
          type="text"
          className="mx-2 input bg-base-300 "
          placeholder="purpose value"
          value={purpose}
          onChange={(e): any => setPurpose(e.target.value)}
        />
      </div>
      <div className="flex ">
        <button
          className="m-2 btn btn-primary"
          onClick={async (): Promise<any> => {
            const saltByte32 = formatBytes32String(salt as string);
            const deploy_tx = await YourFactory?.deployYourContract(saltByte32, purpose as string);
            const deploy_rcpt = await deploy_tx?.wait();
            console.log('deploy_rcpt: ', deploy_rcpt);
          }}>
          deploy
        </button>
        <button
          className="m-2 btn btn-secondary"
          onClick={async (): Promise<any> => {
            const last_address = await YourFactory?.latestContractAddress();
            console.log('last_address: ', last_address);
          }}>
          get address
        </button>
      </div>
    </div>
  );
};
export default Create2Test;
