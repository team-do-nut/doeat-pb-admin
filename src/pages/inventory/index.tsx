import { GetStaticProps } from 'next';

const InventoryPage = () => null;

export const getStaticProps: GetStaticProps = async () => ({
  redirect: {
    destination: '/inventory/record-history',
    permanent: true,
  },
});

export default InventoryPage;
