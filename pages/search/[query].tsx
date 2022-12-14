import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { GetServerSideProps, NextPage } from 'next';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  haveFoundProducts: boolean;
  query: string
}

const SearchPage: NextPage<Props> = ({products, haveFoundProducts, query}) => {

  return (
    <ShopLayout title='Teslo-Shop - Search' pageDescription='Encuentra los mejores productos de Teslo aqui'>
      <Typography variant='h1' component='h1'>Buscar producto</Typography>

      { 
        haveFoundProducts 
        ? <Typography variant='h2' sx={{ mb:1 }} textTransform='capitalize'>{query}</Typography>
        : (
            <Box display={'flex'}>
              <Typography variant='h2' sx={{ mb:1 }}>
                No encontramos ningun producto
              </Typography>
              <Typography variant='h2' sx={{ ml:1, mb:1 }} color='secondary' textTransform='capitalize'>
                {query}
              </Typography>
            </Box>
          )
      }
      

      <ProductList products={ products } />

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query : string}
  
  if ( query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await dbProducts.getProductsByTerm(query)
  const haveFoundProducts = products.length > 0

  if ( !haveFoundProducts ){
    products = await dbProducts.getAllProducts()
  }

  return {
    props: {
      products,
      haveFoundProducts,
      query
    }
  }
}

export default SearchPage
