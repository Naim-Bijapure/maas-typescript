import API from '~~/config/API';

export const fetchContracts = async (account: string, chainId: number): Promise<any> => {
  console.log('chainId: ', chainId);
  const response = await API.get(`/contractList/${account}/${chainId}`);
  const contracts = response.data['allContracts'];
  console.log('contracts: ', contracts);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [...contracts];
};
