export interface IHighlightedStore {
  id: string;
  priority: number;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
  store: IStore;
}

export class CreateStoreData {
  name: string = ''
  cnpj: string = ''
  description: string = ''
  businessHours: IBusinessHours = {} as IBusinessHours
  minOrderValue: string = ''
  minOrderQuantity: number = 0
  instagram: string = ''

  constructor(
      fd?: any
  ) {
      this.name = fd.name
      this.description = fd.description
      this.minOrderValue = this.formatPrice(fd.minOrderValue)
      this.minOrderQuantity = fd.minOrderQuantity
      this.instagram = fd.instagram
      this.cnpj = fd.cnpj
      this.businessHours = {
        mon: fd.monday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        tue: fd.tuesday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        wed: fd.wednesday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        thu: fd.thursday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        fri: fd.friday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        sat: fd.saturday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        sun: fd.sunday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : []
    }
  }

  public formatPrice(value: string) {
    return value.replace("R$ ", '')
  }
}

export class EditStoreData {
  description: string = ''
  businessHours: IBusinessHours = {} as IBusinessHours
  minOrderValue: string = ''
  minOrderQuantity: number = 0
  instagram: string = ''
  isActive: boolean = false
  privateImageUrls: string[] = []

  constructor(
      fd?: any,
      imagesUrl: string[] = []
  ) {
      this.isActive = fd.isActive
      this.description = fd.description
      this.minOrderValue = this.formatPrice(fd.minOrderValue)
      this.minOrderQuantity = fd.minOrderQuantity
      this.instagram = fd.instagram
      this.privateImageUrls = imagesUrl
      this.businessHours = {
        mon: fd.monday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        tue: fd.tuesday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        wed: fd.wednesday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        thu: fd.thursday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        fri: fd.friday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        sat: fd.saturday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : [],
        sun: fd.sunday ? [{ open: fd.businessHours.open, close: fd.businessHours.close}] : []
    }
  }

  public formatPrice(value: string) {
    return value.replace("R$ ", '')
  }
}

export class IStore {
  id: string = ''
  name: string = ''
  description: string = ''
  minOrderValue: string = ''
  minOrderQuantity: number = 0
  isActive: boolean = false
  cnpj: string = ''
  instagram: string = ''
  createdAt: string = ''
  updatedAt: string = ''
  businessHours: IBusinessHours = {} as IBusinessHours
  publicImageUrls: string[] = []
  privateImageUrls: string[] = []
  currentPlanId: string = ''
  expiresAt: string = ''

  public static hasFormFieldChanged(store: IStore, fd?: any) {
    const time = IStore.getHour(store)
    return store.description !== fd.description ||
    store.isActive !== fd.isActive ||
    store.minOrderValue !== IStore.formatPrice(fd.minOrderValue) ||
    store.minOrderQuantity !== fd.minOrderQuantity ||
    store.instagram !== fd.instagram ||
    store.businessHours.mon?.length > 0 !== fd.monday ||
    store.businessHours.tue?.length > 0 !== fd.tuesday ||
    store.businessHours.wed?.length > 0 !== fd.wednesday ||
    store.businessHours.thu?.length > 0 !== fd.thursday ||
    store.businessHours.fri?.length > 0 !== fd.friday ||
    store.businessHours.sat?.length > 0 !== fd.saturday ||
    store.businessHours.sun?.length > 0 !== fd.sunday ||
    time.open !== fd.businessHours.open ||
    time.close !== fd.businessHours.close
  }

  public static formatPrice(value: string) {
    return value.replace("R$ ", '')
  }

  public static formatCnpj(value: string) {
    return value.replace(/\D+/g, "")
  }

  public static getHour(store: IStore) {
    function aux( entity: IOpeningHours[]): IOpeningHours | null {
      if (entity?.length > 0) {
        return entity[0]
      } else {
        return null
      }
    }

    const mon = aux(store.businessHours.mon)
    const tue = aux(store.businessHours.tue)
    const wed = aux(store.businessHours.wed)
    const thu = aux(store.businessHours.thu)
    const fri = aux(store.businessHours.fri)
    const sat = aux(store.businessHours.sat)
    const sun = aux(store.businessHours.sun)

    if (mon !== null) return mon
    if (tue !== null) return tue
    if (wed !== null) return wed
    if (thu !== null) return thu
    if (fri !== null) return fri
    if (sat !== null) return sat
    if (sun !== null) return sun
    return { open: "08:00", close:"18:00"} as IOpeningHours
  }
}

export interface IBusinessHours {
  mon: IOpeningHours[];
  tue: IOpeningHours[];
  wed: IOpeningHours[];
  thu: IOpeningHours[];
  fri: IOpeningHours[];
  sat: IOpeningHours[];
  sun: IOpeningHours[];
}

export interface IOpeningHours {
  open: string;
  close: string;
}

export class StorePageMetadata {
  page: number = 0 
  limit: number = 0
  itemCount: number = 0
  pageCount: number = 0
  hasPreviousPage: boolean = false
  hasNextPage: boolean = false
}

export class StorePage {
  data: Array<IStore> = []
  meta: StorePageMetadata = {} as StorePageMetadata
}