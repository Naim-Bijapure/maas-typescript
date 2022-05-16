/* eslint-disable */
//import './helpers/__global';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * 🏹 See MainPage.tsx for main app component!
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * This file loads react.
 * You don't need to change this file!!
 */

/**
 * Loads {@see App} which sets up the application async.
 * The main page is in the component {@see MainPage}
 */
// import ReactDOM from 'react-dom/client';

const run = async (): Promise<void> => {
  await import('./helpers/__global');
  // dynamic imports for code splitting
  const { lazy, Suspense, StrictMode } = await import('react');
  // const ReactDOM = await import('react-dom');
  const ReactDOM = await import('react-dom/client');

  const App = lazy(() => import('./App'));

  //@ts-ignore
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <Suspense fallback={<div />}>
        <App />
      </Suspense>
    </StrictMode>
  );
  // const root = ReactDOM.createRoot(document.getElementById('root'));
  // root.render(
  //   <StrictMode>
  //     <Suspense fallback={<div />}>
  //       <App />
  //     </Suspense>
  //   </StrictMode>
  // );
};

void run();

export {};
