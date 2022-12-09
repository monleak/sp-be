import SupplierController from '@/controllers/supplier.controller';
import { CreateSupplierDto } from '@/dtos/supplier.dto';
import CRUDRoute from './base/crud.routes';

class SupplierRoute extends CRUDRoute {
  constructor() {
    super('/supplier', new SupplierController(), CreateSupplierDto, CreateSupplierDto);
  }
}

export default SupplierRoute;