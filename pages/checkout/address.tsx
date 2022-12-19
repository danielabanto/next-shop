import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries } from '../../utils/countries';
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useCartContext } from '../../context';

type FormData = {
  firstname: string;
  lastname: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const getAddressFromCookies = ():FormData => ({
  firstname : Cookies.get('firstname') || '',
  lastname  : Cookies.get('lastname') || '',
  address   : Cookies.get('address') || '',
  address2  : Cookies.get('address2') || '',
  zip       : Cookies.get('zip') || '',
  city      : Cookies.get('city') || '',
  country   : Cookies.get('country') || countries[0].code,
  phone     : Cookies.get('phone') || '',
})

const AddressPage = () => {
  const router = useRouter()
  const { updateAddress } = useCartContext()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      firstname: '',
      lastname: '',
      address: '',
      address2: '',
      zip: '',
      city: '',
      country: countries[0].code,
      phone: '',
    }
  });

  useEffect(() => {
    reset( getAddressFromCookies() )
  },[])

  const onSubmit = ( data : FormData) => {    
    updateAddress( data )
    router.push('/checkout/summary')
  }
  return (
    <ShopLayout title='Direccion' pageDescription='Confirmar direccion del destino'>
      <Typography variant='h1' component={'h1'}>
        Direccion
      </Typography>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <Grid container spacing={2} sx={{ mt:2 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Nombre' 
              variant='filled' 
              fullWidth 
              {...register('firstname', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.firstname}
              helperText={errors.firstname?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Apellido'
              variant='filled'
              fullWidth 
              {...register('lastname', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.lastname}
              helperText={errors.lastname?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Direccion' 
              variant='filled' 
              fullWidth 
              {...register('address', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Direccion 2 (opciona)' 
              variant='filled' 
              fullWidth 
              {...register('address2')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Codigo postal' 
              variant='filled' 
              fullWidth 
              {...register('zip', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Ciudad' 
              variant='filled' 
              fullWidth 
              {...register('city', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
              <TextField
                // select 
                variant='filled' 
                label='Pais' 
                // defaultValue={ Cookies.get('country') || countries[0].code }
                fullWidth
                {...register('country', {
                  required: 'Este campo es requerido',
                })}
                error = {!!errors.country}
                helperText={errors.country?.message}
              />
                {/* {countries.map((country) => (
                  <MenuItem 
                    value={country.code}
                    key={country.code}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </TextField> */}
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Telefono' 
              variant='filled' 
              fullWidth 
              {...register('phone', {
                required: 'Este campo es requerido',
              })}
              error = {!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt:5 }} display='flex' justifyContent={'center'}>
          <Button type='submit' color='secondary' className='circular-btn' size='large'>
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// LO HAREMOS CON MIDDLEWARES

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { req } = ctx
//   const { token = ''} = req.cookies
//   let isValidToken = false

//   try {
//     await jwt.isValidToken( token )
//     isValidToken = true
//   } catch ( err ) {

//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {
      
//     }
//   }
// }

export default AddressPage