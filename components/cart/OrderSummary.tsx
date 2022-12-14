import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useCartContext } from '../../context/cart/CartContext';
import { currency } from '../../utils';

export const OrderSummary = () => {

  const { numberOfItems, subtotal, tax, total } = useCartContext()

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{numberOfItems} producto{numberOfItems > 1 ? 's': ''}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{ currency.format(subtotal) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ process.env.NEXT_PUBLIC_TAX_RATE})</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{ currency.format(tax) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:2}}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{mt:2}} display='flex' justifyContent={'end'}>
        <Typography variant='subtitle1'>{ currency.format(total) }</Typography>
      </Grid>

    </Grid>
  )
}
