import { BotEntity } from '..';

export class BotVariable {
  id?: string;
  name?: string;
  entity?: BotEntity;
  description?: string;
  isSystem?: boolean;

  constructor(variable: BotVariable) {
    this.id = variable.id;
    this.name = variable.name;
    this.entity = new BotEntity(variable?.entity || {});
    this.description = variable.description;
    this.isSystem = variable.isSystem;
  }
}
