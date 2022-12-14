import { Box, Button } from '@mui/material';
import React, { FC } from 'react'
import { ISize } from '../../interfaces/products';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  modifySize: (size: ISize) => void
}

export const ProductSizeSelector: FC<Props> = ({ selectedSize, sizes, modifySize }) => {
  return (
    <Box>
      {
        sizes.map( size => (
          <Button 
            key={ size } 
            size='small' 
            color={ selectedSize === size ? 'primary' : 'info' }
            onClick={ () => modifySize(size) }
          >
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
