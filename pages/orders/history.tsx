import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import React from 'react'
import { ShopLayout } from '../../components/layouts/ShopLayout';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100},
  { field: 'fullname', headerName: 'Nombre Completo', width: 300},
  { 
    field: 'paid', 
    headerName: 'Pagada', 
    description: 'Muestra informacion si esta pagada o no',
    width: 300,
    renderCell: (params: GridRenderCellParams) => {
      return (
        params.row.paid
        ? <Chip color='success' label='Pagada' variant='outlined' />
        : <Chip color='error' label='No pagada' variant='outlined' />
      )
    }
  },
  { 
    field: 'order', 
    headerName: 'Ver orden', 
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${ params.row.id }`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    }
  }
]

const rows = [
  { id: 1, paid: true, fullname: 'Daniel Abanto' },
  { id: 2, paid: false, fullname: 'Mariajesus Noriega' },
  { id: 3, paid: true, fullname: 'Jose Abanto' },
  { id: 4, paid: false, fullname: 'Santi Abanto' },
  { id: 5, paid: true, fullname: 'Julieta Abanto' },
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'> 
      <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
          <DataGrid
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions= { [10] }
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default HistoryPage