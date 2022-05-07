import React from 'react';
import { useParams } from 'react-router-dom';

const Index: React.FC = () => {
  const params = useParams();
  console.log('params: ', params);
  return <div>my fun compo</div>;
};
export default Index;
