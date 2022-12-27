import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useCartContext } from '../../context/cart/CartContext';
import { IOrder } from '../../interfaces';
import { currency } from '../../utils';

interface Props {
  order?: IOrder
}

export const OrderSummary = ({ order }: Props) => {

  const { numberOfItems, subtotal, tax, total } = useCartContext()

  const numberOfItemsToShow = order?.numberOfItems || numberOfItems
  const subtotalToShow = order?.subTotal || subtotal
  const taxToShow = order?.tax || tax
  const totalToShow = order?.total || total

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{numberOfItemsToShow} producto{numberOfItemsToShow > 1 ? 's': ''}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{ currency.format(subtotalToShow) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ process.env.NEXT_PUBLIC_TAX_RATE})</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent={'end'}>
        <Typography>{ currency.format(taxToShow) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:2}}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>
      <Grid item xs={6} sx={{mt:2}} display='flex' justifyContent={'end'}>
        <Typography variant='subtitle1'>{ currency.format(totalToShow) }</Typography>
      </Grid>

    </Grid>
  )
}
