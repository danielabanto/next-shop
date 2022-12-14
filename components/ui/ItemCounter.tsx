import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react'
import { FC } from 'react';

interface Props {
  currentValue: number,
  updateQuantity: (val:number) => void,
  maxValue: number,
}

export const ItemCounter: FC<Props> = ({ currentValue, updateQuantity, maxValue }) => {
  return (
    <Box display={'flex'} alignItems='center'>
      <IconButton onClick={() => updateQuantity(-1)} disabled={ currentValue<2 }>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center'}}>{ currentValue }</Typography>
      <IconButton onClick={() => updateQuantity(1)} disabled={ currentValue >= maxValue }>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
