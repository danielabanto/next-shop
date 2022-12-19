import React, { useState } from 'react'
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../context';

type FormData = {
  email: string,
  password: string,
  name: string;
};

const RegisterPage = () => {

  const router = useRouter()
  const { registerUser } = useAuthContext()
  const { register, handleSubmit, formState: { errors }} = useForm<FormData>()
  const [ showError, setShowError ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')

  const onRegisterForm = async ( { name, email, password }: FormData) => {

    setShowError(false)
    const { hasError, message } = await registerUser(name, email, password)

    if (hasError) {
      setShowError(true)
      setErrorMessage( message! )
      setTimeout( () => { setShowError(false) }, 3000)
      return;
    }

    // const destination = router.query.p?.toString() || '/'
    // router.replace(destination)
    await signIn('credentials', { email, password })
  }

  return (
    <AuthLayout title='Registrarse'>
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear cuenta</Typography>
              <Chip 
                label={errorMessage}
                color='error'
                icon={ <ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Nombre completo' 
                variant='filled' 
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 3, message: 'Minimo 3 caracteres' }
                })}
                error={ !!errors.name}
                helperText={ errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Correo' 
                type='email' 
                variant='filled' 
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: validations.isEmail,
                })}
                error={ !!errors.email}
                helperText={ errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Contrasena' 
                type='password' 
                variant='filled' 
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Minimo 6 caracteres'}
                })}
                error={ !!errors.password}
                helperText={ errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                Registrar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent={'end'}>
              <NextLink 
                href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login' }
                passHref
              >
                <Link underline='always'>
                  Ya tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, query } = ctx
  const session = await getSession({ req })

  const { p = '/' } = query

  if ( session ){
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default RegisterPage