import styled from '@emotion/styled';
import Head from 'next/head';

const StyledDiv = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;
`;

const TestDiv = styled.div<{ $fontWeight: number }>`
  font-weight: ${({ $fontWeight }) => $fontWeight};
`;

const Home = () => (
  <div>
    <Head>
      <title>Doeat PB Admin</title>
      <meta name="description" content="Doeat PB Admin Dashboard" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>
      <h1>Welcome to Doeat PB Admin</h1>
      <StyledDiv />
      <TestDiv $fontWeight={100}>1</TestDiv>
      <TestDiv $fontWeight={200}>2</TestDiv>
      <TestDiv $fontWeight={300}>3</TestDiv>
      <TestDiv $fontWeight={400}>4</TestDiv>
      <TestDiv $fontWeight={500}>5</TestDiv>
      <TestDiv $fontWeight={600}>6</TestDiv>
      <TestDiv $fontWeight={700}>7</TestDiv>
      <TestDiv $fontWeight={800}>8</TestDiv>
      <TestDiv $fontWeight={900}>9</TestDiv>
      <StyledDiv />
    </main>
  </div>
);

export default Home;
