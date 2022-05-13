import '@scaffold-eth/common/src/env';

declare module '*.svg' {
  const content: any;
  export default content;
}

///   <reference types="vite-plugin-svgr/client" />
