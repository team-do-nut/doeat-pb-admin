import { GetServerSideProps } from 'next';

const InventoryPage = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/inventory/record-history',
    permanent: true,
  },
});

export default InventoryPage;
