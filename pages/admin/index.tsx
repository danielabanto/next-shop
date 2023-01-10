import {  AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces'

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, //30 segundos
  })

  const [ refreshIn, setRefreshIn ] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn( prev => {
        if( prev > 0){
          return prev - 1
        } else {
          return 30
        }
      })
    }, 1000)
    return () => clearInterval( interval )
  }, [])

  if( !error && !data ) {
    return <>Cargando...</>
  }

  if( error ){
    console.error(error)
    return(
      <Typography>Error cargando la informacion</Typography>
    )
  }

  const { 
    numberOfOrders,
    paidOrders,
    noPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  } = data!

  return (
    <AdminLayout 
      title='Dashboard'
      subtitle='Estadisticas Generales'
      icon={ <DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile 
          title={ numberOfOrders }
          subtitle='Ordenes totales'
          icon={ <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ paidOrders }
          subtitle='Ordenes pagadas'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ noPaidOrders }
          subtitle='Ordenes pendientes'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ numberOfClients }
          subtitle='Clientes'
          icon={ <CreditCardOffOutlined color='primary' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ numberOfProducts }
          subtitle='Productos'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={productsWithNoInventory }
          subtitle='Sin existencias'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ lowInventory }
          subtitle='Bajo inventario'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40}} />} 
        />
        <SummaryTile 
          title={ refreshIn }
          subtitle='Actualizacion en:'
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40}} />} 
        />
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage