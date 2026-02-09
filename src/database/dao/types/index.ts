import { ExpressionBuilder as KyselyExpressionBuilder, SelectQueryBuilder } from "kysely";

export type ExpressionBuilder<QB extends SelectQueryBuilder<any, any, any>> = QB extends SelectQueryBuilder<infer DB, infer TB, any>
                                                                              ? KyselyExpressionBuilder<DB, TB>
                                                                              : never;