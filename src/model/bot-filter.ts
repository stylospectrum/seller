import { BotFilterOperator } from '@/enums';

export class BotFilter {
  id?: string | null;
  attribute?: string;
  value?: string;
  operator?: BotFilterOperator;
  storyBlockId?: string;
  subExprs?: BotFilter[];

  constructor(filter: BotFilter) {
    this.id = filter.id;
    this.attribute = filter.attribute;
    this.value = filter.value;
    this.operator = filter.operator;
    this.subExprs = (filter.subExprs || []).map((expr) => new BotFilter(expr));
  }
}
