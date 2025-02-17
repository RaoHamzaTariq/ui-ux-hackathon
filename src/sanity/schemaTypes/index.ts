import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './productType'
import userType from './userType'
import shipmentType from './shipmentType'
import orderType from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType,userType,orderType,shipmentType],
}
