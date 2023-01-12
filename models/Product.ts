import mongoose, { Schema, model, Model } from 'mongoose';
import { IProduct } from '../interfaces/products';

const productSchema = new Schema({
  description : { type: String, required: true, default: ''},
  images      : [{ type: String}],
  inStock     : { type: Number, required: true, default: 0 },
  price       : { type: Number, required: true, default: 0 },
  sizes       : [{ 
    type: String, 
    enum: {
      values:  ['XS','S','M','L','XL','XXL','XXXL'],
      message: '{VALUE} no es un tamano permitido'
    }
  }],
  slug        : { type: String, required: true, unique: true },
  // unique le crea un indice unico que agiliza las consultas
  tags        : [{ type: String }],
  title       : { type: String, required: true, default: '' },
  type        : { 
    type: String, 
    enum: {
      values:  ['shirts','pants','hoodies','hats'],
      message: '{VALUE} no es un tipo valido'
    },
    default: 'shirts'
  },
  gender      : { 
    type: String, 
    enum: {
      values:  ['men','women','kid','unisex'],
      message: '{VALUE} no es un genero valido'
    },
    default: 'women'
  },
}, {
  // Crea automaticamente el createdAt y updatedAt
  timestamps: true
})

// Indice de Mongo
productSchema.index({ title: 'text', tags: 'text'})

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema)

export default Product