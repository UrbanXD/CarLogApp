import { UserAccount, userSchema } from "../../schemas/userSchema.ts";
import { UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { getUserLocalCurrency } from "../../../_shared/currency/utils/getUserLocalCurrency.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { Image } from "../../../../types/zodTypes.ts";

export class UserMapper extends AbstractMapper<UserTableRow, UserAccount> {
    private readonly currencyDao: CurrencyDao;
    private readonly attachmentQueue?: PhotoAttachmentQueue;

    constructor(currencyDao: CurrencyDao, attachmentQueue?: PhotoAttachmentQueue) {
        super();
        this.currencyDao = currencyDao;
        this.attachmentQueue = attachmentQueue;
    }

    async toDto(entity: UserTableRow): Promise<UserAccount> {
        const [currency, avatar]: [Currency | null, Image | null] = await Promise.all([
            this.currencyDao.getById(entity.currency_id, false),
            getImageFromAttachmentQueue(this.attachmentQueue, entity.avatar_url)
        ]);


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
            avatar: avatar
        });
    }

    async toEntity(dto: UserAccount): Promise<UserTableRow> {
        return {
            id: dto.id,
            email: dto.email,
            firstname: dto.firstname,
            lastname: dto.lastname,
            currency_id: dto.currency.id,
            avatar_color: dto.avatarColor,
            avatar_url: dto.avatar?.fileName ?? null
        };
    }
}