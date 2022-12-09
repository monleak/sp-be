import { PriceQuotationCreationAttributes } from '@/models/priceQuotation.model';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class CreatePriceQuotationDto implements PriceQuotationCreationAttributes {
  @IsNumber()
  public supplier_id: number;
  @IsNumber()
  public product_id: number;
  @IsNumber()
  public subproduct_id: number;
  @IsNumber()
  public unit_price: number;
  @IsString()
  @IsOptional()
  public created_by: string;
  @IsString()
  @IsOptional()
  public updated_by: string;
}

export default CreatePriceQuotationDto;