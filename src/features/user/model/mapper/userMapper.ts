import { UserAccount, userSchema } from "../../schemas/userSchema.ts";
import { UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { getUserLocalCurrency } from "../../../_shared/currency/utils/getUserLocalCurrency.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";

export class UserMapper extends AbstractMapper<UserTableRow, UserAccount> {
    private readonly currencyDao: CurrencyDao;
    private readonly attachmentQueue?: PhotoAttachmentQueue;

    constructor(currencyDao: CurrencyDao, attachmentQueue?: PhotoAttachmentQueue) {
        super();
        this.currencyDao = currencyDao;
        this.attachmentQueue = attachmentQueue;
    }

    async toDto(entity: UserTableRow): Promise<UserAccount> {
        const currency = entity.currency_id ? await this.currencyDao.getById(entity.currency_id, false) : null;

        let localCurrency;
        if(!currency) {
            localCurrency = await this.currencyDao.getById(getUserLocalCurrency());
        }

        return userSchema.parse({
            id: entity.id,
            email: entity.email,
            firstname: entity.firstname,
            lastname: entity.lastname,
            currency: currency ?? localCurrency,
            avatarColor: entity.avatar_color,
            avatarPath: entity.avatar_url
        });
    }

    async toEntity(dto: UserAccount): Promise<UserTableRow> {
        return {
            id: dto.id,
            email: dto.email,
            firstname: dto.firstname ?? null,
            lastname: dto.lastname ?? null,
            currency_id: dto.currency.id,
            avatar_color: dto.avatarColor ?? null,
            avatar_url: dto.avatarPath ?? null
        };
    }
}