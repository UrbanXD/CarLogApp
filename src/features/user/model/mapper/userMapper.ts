import { UserAccount, userSchema } from "../../schemas/userSchema.ts";
import { UserTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { SelectUserTableRow } from "../dao/UserDao.ts";

export class UserMapper extends AbstractMapper<UserTableRow, UserAccount, SelectUserTableRow> {
    constructor() {
        super();
    }

    toDto(entity: SelectUserTableRow): UserAccount {
        return userSchema.parse({
            id: entity.id,
            email: entity.email,
            firstname: entity.firstname,
            lastname: entity.lastname,
            currency: {
                id: entity.currency_id,
                key: entity.currency_key,
                symbol: entity.currency_symbol
            },
            avatarColor: entity.avatar_color,
            avatarPath: entity.avatar_url
        });
    }

    toEntity(dto: UserAccount): UserTableRow {
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