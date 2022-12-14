import { Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';


export default function WomenPage() {
  const { products, isLoading } = useProducts('/products?gender=women')

  return (
    <ShopLayout title='Teslo-Shop - Women' pageDescription='Encuentra los mejores productos de Teslo para Mujeres'>
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{ mb:1 }}>Productos para mujeres</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />

      }

    </ShopLayout>
  )
}