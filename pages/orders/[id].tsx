import React, { useState } from 'react'
import { Card, CardContent, Divider, Grid, Typography, Box, Link, Chip, CircularProgress } from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { PayPalButtons } from "@paypal/react-paypal-js";


import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';

type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter()
  const [ isPaying, setIsPaying ] = useState(false)

  const { shippingAddress } = order

  const onOrderCompleted = async ( details: OrderResponseBody ) => {
    if (details.status!=='COMPLETED') return alert('No hay pago en paypal')
    setIsPaying(true)
    try{
      const { data } = await tesloApi.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id
      })
      router.reload()
    } catch(err) {
      setIsPaying(false)
      console.log(err)
    }
  }

  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1' sx={{ mb:2 }}>
        Orden: { order._id}
      </Typography>
      { order.isPaid 
        ? (
          <Chip 
            sx={{ my:2 }} 
            label='Orden ya fue pagada' 
            variant='outlined' 
            color='success'
            icon={ <CreditScoreOutlined /> }
          />
        ) : (
          <Chip 
            sx={{ my:2 }} 
            label='Pendiente de pago' 
            variant='outlined' 
            color='error'
            icon={ <CreditCardOffOutlined /> }
          /> 

        )
      }
      
      <Grid container className='fadeIn'>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList products={ order.orderItems }/>
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({ order.numberOfItems} producto{order.numberOfItems > 1 ? 's' : ''})
              </Typography>
              <Divider sx={{ my:1 }} />

              <Box display={'flex'} justifyContent='space-between'>
                <Typography variant='subtitle1'>Direccion de entrega</Typography>
              </Box>

              <Typography>{ shippingAddress.firstname } { shippingAddress.lastname }</Typography>
              <Typography>
                { shippingAddress.address } { shippingAddress.address2 ? `, ${shippingAddress.address2}` : '' }
              </Typography>
              <Typography>{ shippingAddress.city }, {shippingAddress.zip}</Typography>
              <Typography>{ shippingAddress.country }</Typography>
              <Typography>{ shippingAddress.phone }</Typography>
              
              <Divider sx={{ my:1 }} />

              <OrderSummary order={order}/>

              <Box sx={{ mt:3 }} display='flex' flexDirection='column'>
                <Box 
                  justifyContent='center' 
                  className='fadeIn'
                  sx={{ display: isPaying ? 'flex' : 'none'}}
                >
                  <CircularProgress />
                </Box>
                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>
                  {
                    order.isPaid 
                    ? ( 
                      <Chip 
                        sx={{ my:2 }} 
                        label='Orden ya fue pagada' 
                        variant='outlined' 
                        color='success'
                        icon={ <CreditScoreOutlined /> }
                      />
                    ) : (
                      <PayPalButtons 
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: `${order.total}`,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then(( details ) => {
                            // console.log("🚀 ~ file: [id].tsx:105 ~ returnactions.order!.capture ~ details", details)
                            // const name = details.payer.name!.given_name;
                            onOrderCompleted( details )
                          });
                        }}
                      />
                    )
                  }
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { id = '' } = query
  const session:any = await getSession({ req })

  if( !session ) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${ id }`,
        permanent: false,
      }
    }
  }

  const order = await dbOrders.getOrderById( id.toString() )
  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  if ( order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage