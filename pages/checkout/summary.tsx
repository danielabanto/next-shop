import React, { useEffect, useState } from 'react'
import { Card, CardContent, Divider, Grid, Typography, Box, Button, Link, Chip } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useCartContext } from '../../context/cart/CartContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const router = useRouter()
  const { shippingAddress, numberOfItems, createOrder } = useCartContext()

  const [ isPosting, setIsPosting ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')

  useEffect(() => {
    if ( !Cookies.get('firstname') ) {
      router.push('/checkout/address')
    }
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder()

    if (hasError) {
      setIsPosting(false)
      setErrorMessage( message )
      return 
    }

    router.replace(`/orders/${message}`)
  }

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

              <Box sx={{ mt:3 }} display='flex' flexDirection={'column'}>
                <Button 
                  color='secondary' 
                  className='circular-btn' 
                  fullWidth
                  onClick={ onCreateOrder }
                  disabled={ isPosting }
                >
                  Confirmar orden
                </Button>
                <Chip
                  color='error'
                  label={ errorMessage }
                  sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                />
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage