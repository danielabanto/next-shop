import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';


export default function KidPage() {
  const { products, isLoading } = useProducts('/products?gender=kid')

  return (
    <ShopLayout title='Teslo-Shop - Kids' pageDescription='Encuentra los mejores productos de Teslo para Kids'>
      <Typography variant='h1' component='h1'>Ninos</Typography>
      <Typography variant='h2' sx={{ mb:1 }}>Productos para ninos</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />

      }

    </ShopLayout>
  )
}