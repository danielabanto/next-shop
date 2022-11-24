import { Box, Button } from '@mui/material';
import React, { FC } from 'react'
import { ISize } from '../../interfaces/products';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
}

export const ProductSizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
  console.log({ sizes })
  console.log({ selectedSize })
  return (
    <Box>
      {
        sizes.map( size => (
          <Button key={ size } size='small' color={ selectedSize === size ? 'primary' : 'info' }>
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
