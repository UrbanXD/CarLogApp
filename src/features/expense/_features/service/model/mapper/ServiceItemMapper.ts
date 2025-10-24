import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceItemTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItem, serviceItemSchema } from "../../schemas/serviceItemSchema.ts";
import { ServiceItemTypeDao } from "../dao/ServiceItemTypeDao.ts";

export class ServiceItemMapper extends AbstractMapper<ServiceItemTableRow, ServiceItem> {
    private readonly serviceItemTypeDao: ServiceItemTypeDao;

    constructor(serviceItemTypeDao: ServiceItemTypeDao) {
        super();
        this.serviceItemTypeDao = serviceItemTypeDao;
    }

    async toDto(entity: ServiceItemTableRow): Promise<ServiceItem> {
        const type = await this.serviceItemTypeDao.getById(entity.service_item_type_id);

        return serviceItemSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            serviceLogId: entity.service_log_id,
            type: type,
            quantity: entity.quantity,
            pricePerUnit: entity.price_per_unit
        });
    }

    async toEntity(dto: ServiceItem): Promise<ServiceItemTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            service_log_id: dto.serviceLogId,
            service_item_type_id: dto.type.id,
            quantity: dto.quantity,
            price_per_unit: dto.pricePerUnit
        };
    }
}