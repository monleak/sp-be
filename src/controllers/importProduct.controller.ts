import CreateImportProductDto from '@/dtos/importProduct.dto';
import { ImportProduct } from '@/interfaces/importProduct.interface';
import ImportProductService from '@/services/importProduct.service';
import CRUDController from './base/crud.controller';
import { Request } from 'express';
import { NextFunction, Response } from 'express-serve-static-core';
import DB from '@/databases';
import { QueryTypes } from 'sequelize';
import { resolveTxt } from 'dns';

class ImportProductController extends CRUDController<ImportProduct, CreateImportProductDto, CreateImportProductDto, ImportProductService> {
  constructor() {
    super(new ImportProductService());
  }

  /**
   * So luong import theo thang trong nam
   * @author HieuTT
   */
  public async getHistoryStatistical(req: Request, res: Response) {
    let year;
    try {
      year = Number.parseInt(req.query?.year as string);
      if (!year) {
        res.send('Cần có tham số là năm');
        return res.status(400);
      }
    } catch (e) {
      res.status(400).send('Failed to parse year!');
    }
    const sql = `select date_part('month',"created_at"::timestamp) thang, sum(quantity) count
            from import_product
            where date_part('year',"created_at"::timestamp) = ${year}
            group by date_part('month',"created_at"::timestamp)
            ;`;

    const data = await DB.sequelize.query(sql, { type: QueryTypes.SELECT });
    return res.status(200).json({
      year,
      data,
    });
  }

  /**
   * Lich su nhap hang
   * @author HieuTT
   *
   * @deprecated use /import instead
   */
  public async getHistory(req: Request, res: Response) {
    let page: any = req.query.page;
    if (page < 1 || page === undefined) page = 1;

    const typeTime = req.query.typeTime;
    let year;
    let quarter;
    let time;
    if (typeTime === 'quarter') {
      if (req.query.time != undefined) {
        time = new Date(req.query.time as any);
        year = time.getFullYear();
        quarter = Math.floor((time.getMonth() + 1) / 3 + 1);
      } else if (req.query.quarter != undefined && req.query.year != undefined) {
        year = req.query.year;
        quarter = req.query.quarter;
      } else {
        res.send('Thiếu input!!!!');
        return res.status(401);
      }
    } else if (typeTime != undefined) {
      const time = new Date(req.query.time as any);
    }
    let sql;
    if (typeTime === undefined) {
      //Nếu time null thì trả về toàn bộ danh sách
      sql = `select * from import_product limit 10 offset (${page}-1)*10;`;
    } else if (typeTime === 'quarter') {
      //Get dữ liệu theo quý (một quý có 3 tháng)
      sql = `select * from import_product where
                    floor(date_part(\'month\',\"created_at\"::timestamp)/3+1) = ${quarter}
                    and date_part(\'year\',\"created_at\"::timestamp) = ${year}
                    limit 10 offset (${page}-1)*10;`;
    } else if (typeTime === 'day') {
      //Get dữ liệu theo ngày
      sql = `select * from import_product where
                    date_part(\'day\',\"created_at\"::timestamp) = ${time.getDate()}
                    and date_part(\'month\',\"created_at\"::timestamp) = ${time.getMonth() + 1}
                    and date_part(\'year\',\"created_at\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`;
    } else if (typeTime === 'month') {
      //Get dữ liệu theo tháng
      sql = `select * from import_product where
                    date_part(\'month\',\"created_at\"::timestamp) = ${time.getMonth() + 1}
                    and date_part(\'year\',\"created_at\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`;
    } else if (typeTime === 'year') {
      //Get dữ liệu theo năm
      sql = `select * from import_product where
                    date_part(\'year\',\"created_at\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`;
    }
    const data = await DB.sequelize.query(sql, { type: QueryTypes.SELECT });
    res.json({
      page: page,
      getBy: { typeTime: typeTime, time: time, quarter: quarter, year: year },
      data: data,
    });
  }

  /**
   * Lấy giá nhập hàng:
   * - Tiêu chí đưa ra giá nhập:
   *  + Chỉ lấy 10 đơn nhập gần nhất trong 1 năn tính đến hiện tại
   * @return Danh sách nhập
   */
  public getImportRecommentUnitPrice = async (req: Request, res: Response) => {
    const { filter } = this._req.parse_filter_raw(req, {
      product_id: 'INTEGER',
      subproduct_id: 'INTEGER',
    });

    const sql = `
    select imp.product_id, imp.subproduct_id, max(price_quotation.unit_price) from (
      select ROW_NUMBER() OVER (PARTITION BY price_quotation_id ORDER BY created_at DESC) AS stt,
        import_product.product_id, import_product.subproduct_id, import_product.price_quotation_id
      from import_product
      where import_product.created_at >= date_trunc('year', now())
    ) as imp
    inner join price_quotation on price_quotation.id = imp.price_quotation_id
    where stt < 10
    group by imp.product_id, imp.subproduct_id;`;
    const data = await DB.sequelize.query(sql, { type: QueryTypes.SELECT, logging: console.log });

    return res.status(200).json({
      count: data?.length,
      filter,
      data,
    });
  };
}

export default ImportProductController;
