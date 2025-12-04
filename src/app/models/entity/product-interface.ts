export interface IHighlightedProduct {
  id: string;
  priority: number;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  product: IProduct;
}

export interface IProduct {
  id: string;
  storeId: string;
  name: string;
  sku: number;
  description: string;
  basePrice: string;
  attributes: IProductAttributes;
  isActive: boolean;
  priceTiers: IPriceTier[];
  categories: string[];
  publicImageUrls: string[];
  privateImageUrls: string[];
  createdAt: string;
  updatedAt: string;
  categoryIds: string[];
}

export interface IProductAttributes {
  sizes: string[];
  colors: string[];
}

export interface EditPriceTier {
  minQty: number;
  unitPrice: string;
}

export interface IPriceTier {
  id: string;
  productId: string;
  minQty: number;
  unitPrice: string;
}

export class CreateProductData {
  name: string = ''
  sku: number = Date.now()
  description: string = ''
  basePrice: string = ''
  attributes: IProductAttributes = {} as IProductAttributes;
  isActive: boolean = false;
  categoryIds: string[] = [];
  priceTiers: EditPriceTier[] = [];

  constructor(
      fd?: any,
      atributes: any = null
  ) {
      this.name = fd.name
      this.description = fd.description
      this.basePrice = this.formatPrice(fd.basePrice)
      if (atributes !== null) {
        this.attributes = atributes
      }
    }

  public formatPrice(value: string) {
    return value.replace("R$ ", '').replace(',', '.')
  }
}

export class EditProductData {
  name: string = ''
  description: string = ''
  basePrice: string = ''
  attributes: IProductAttributes = {} as IProductAttributes;
  isActive: boolean = false;
  categories: string[] = [];
  priceTiers: EditPriceTier[] = [];
  privateImageUrls: string[] = [];
  publicImageUrls: string[] = [];

  constructor(
      fd?: any,
      atributes: any = null
  ) {
      this.name = fd.name
      this.description = fd.description
      this.isActive = fd.isActive
      this.basePrice = this.formatPrice(fd.basePrice)
      if (atributes !== null) {
        this.attributes = atributes
      }
    }

  public formatPrice(value: string) {
    return value.replace("R$ ", '').replace(',', '.')
  }
}

export class ProductPageMetadata {
  page: number = 0 
  limit: number = 0
  itemCount: number = 0
  pageCount: number = 0
  hasPreviousPage: boolean = false
  hasNextPage: boolean = false
}

export class ProductPage {
  data: Array<IProduct> = []
  meta: ProductPageMetadata = {} as ProductPageMetadata
}