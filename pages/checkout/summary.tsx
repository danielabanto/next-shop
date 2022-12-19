import React, { useEffect } from 'react'
import { Card, CardContent, Divider, Grid, Typography, Box, Button, Link } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useCartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils/countries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const { shippingAddress, numberOfItems } = useCartContext()
  const router = useRouter()

  useEffect(() => {
    if ( Cookies.get('firstname') ) {
      router.push('/checkout/address')
    }
  }, [router])

  if ( !shippingAddress ) {
    return <></>
  }

  const { firstname, lastname, address, address2='', city, country, phone, zip } = shippingAddress

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1' sx={{ mb:2 }}>
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({numberOfItems} producto{numberOfItems > 1 ? 's' : ''})
              </Typography>
              <Divider sx={{ my:1 }} />

              <Box display={'flex'} justifyContent='space-between'>
              <Typography variant='subtitle1'>Direccion de entrega</Typography>
                <NextLink href='/checkout/address' passHref>
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{ firstname } { lastname }</Typography>
              <Typography>{ address }{ address2 ? `, ${address2}` : '' }</Typography>
              <Typography>{ city}</Typography>
              {/* <Typography>{ countries.find((c)=> c.code===country)?.name || '' }</Typography> */}
              <Typography>{ country }</Typography>
              <Typography>{ phone}</Typography>
              
              <Divider sx={{ my:1 }} />

              <Box display={'flex'} justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt:3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar orden
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage