/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage';

import API from '~~/config/API';

function getAccessToken(): string {
  const WEB3_TOKEN: string = import.meta.env.VITE_WEB3STORAGE_TOKEN;
  return WEB3_TOKEN;
}
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

function makeFileObjects() {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: 'world', data: 'cooll' };
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });

  const files = [new File([blob], 'hello.json')];
  return files;
}

const Web3StorageTest: React.FC = () => {
  const [currentCid, setCurrentCid] = useState<string>();
  const storeFiles = async (files: File[]): Promise<string> => {
    const onRootCidReady = (cid: string): void => {
      console.log('uploading files with cid:', cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size: number): void => {
      uploaded += size;
      const pct = totalSize / uploaded;
      console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
  };

  const retrieveFiles = async (cid: string): Promise<void> => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res?.status}] ${res?.statusText}`);
    if (!res?.ok) {
      throw new Error(`failed to get ${cid} - [${res?.status}] ${res?.statusText}`);
    }

    // unpack File objects from the response
    const files = await res?.files();
    for (const file of files) {
      console.log('file: ', file);
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
    }
  };

  return (
    <div>
      <h1>Web 3 storage</h1>
      <button
        className="btn btn-primary"
        onClick={async (): Promise<void> => {
          const fileData = makeFileObjects();
          console.log('fileData: ', fileData);
          const cid = await storeFiles(fileData);
          setCurrentCid(cid);
          console.log('cid: ', cid);
        }}>
        store
      </button>

      <button
        className="btn btn-primary"
        onClick={async (): Promise<void> => {
          // const filesData = await retrieveFiles(currentCid as string);
          // console.log('filesData: ', filesData);
          const data = API.get(`https://ipfs.io/ipfs/${currentCid}/hello.json`);
          console.log('data: ', (await data).data);
        }}>
        retrive
      </button>
    </div>
  );
};
export default Web3StorageTest;
