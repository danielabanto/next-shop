import React, { FC } from 'react';
import { Grid } from '@mui/material';
import { IProduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}> 
      {products.map( prod => (
        <ProductCard product={prod} key={prod.slug} />
      ))}
    </Grid>
  )
}
