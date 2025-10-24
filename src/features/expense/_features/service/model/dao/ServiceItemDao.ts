import { Dao } from "../../../../../../database/dao/Dao.ts";
import { DatabaseType, ServiceItemTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { ServiceItemMapper } from "../mapper/ServiceItemMapper.ts";
import { Kysely } from "@powersync/kysely-driver";
import { SERVICE_ITEM_TABLE } from "../../../../../../database/connector/powersync/tables/serviceItem.ts";
import { ServiceItemTypeDao } from "./ServiceItemTypeDao.ts";

export class ServiceItemDao extends Dao<ServiceItemTableRow, ServiceItem, ServiceItemMapper> {
    constructor(db: Kysely<DatabaseType>, serviceItemTypeDao: ServiceItemTypeDao) {
        super(db, SERVICE_ITEM_TABLE, new ServiceItemMapper(serviceItemTypeDao));
    }
}