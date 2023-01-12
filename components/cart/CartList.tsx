import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React, { FC } from 'react'
import { ItemCounter } from '../ui';
import { useCartContext } from '../../context/cart';
import { ICartProduct, IOrderItem } from '../../interfaces';
interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useCartContext()

  const updateQuantity = ( prod : ICartProduct, val: number ) => {
    updateCartQuantity({ ...prod, quantity: prod.quantity + val}) 
  }

  const productsToShow = products || cart

  return (
    <>
      {productsToShow.map( prod => (
        <Grid container spacing={2} key={ prod.slug + prod.size } sx={{ mb:1 }}>
          <Grid item xs={3}>
            {/* TODO: LLevar a la pagina del producto */}
            <NextLink href={`/product/${prod.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia 
                    image={ prod.image } 
                    component='img' 
                    sx={{ borderRadius: '5px'}}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={'flex'} flexDirection='column'>
              <Typography variant='body1'>{prod.title}</Typography>
              <Typography variant='body1'>Talla: <strong>{prod.size}</strong></Typography>

              {/* Conditional */}
              { 
                editable 
                  ? <ItemCounter 
                      currentValue={prod.quantity} 
                      maxValue={30} 
                      updateQuantity={ (val: number) => { updateQuantity(prod as ICartProduct, val) } }
                    /> 
                  : <Typography variant='h5'>
                      {`${prod.quantity} producto${ prod.quantity>1 ? 's' : '' }`}
                    </Typography> 
              }
             
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
            <Typography variant='subtitle1'>${prod.price}</Typography>
            {/* Editable */}
            {
              editable && (
                <Button variant='text' color='secondary' onClick={ ()=> removeCartProduct(prod as ICartProduct) }>
                  Remover
                </Button>
              )
            }
            
          </Grid>
        </Grid>
      ))}
    </>
  )
}
