import Head from 'next/head';
import Navigation from '@src/components/Navigation';
import { useStore } from '@src/core/StoreProvider';

const Home = () => {
  const { storeId } = useStore();

  return (
    <>
      <Head>
        <title>PB | HOME</title>
        <meta name="description" content="Doeat PB Admin Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navigation />
        <main>
          <h1>PB Admin V1.0.0</h1>
          <h3>스토어: {storeId}</h3>
        </main>
      </div>
    </>
  );
};

export default Home;
