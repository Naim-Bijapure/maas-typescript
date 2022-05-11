import API from '~~/config/API';

export const fetchContracts = async (account: string): Promise<any> => {
  const response = await API.get(`/contractList/${account}`);
  const contracts = response.data['allContracts'];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [...contracts];
};
