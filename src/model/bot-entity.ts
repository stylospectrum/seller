class BotEntitySynonym {
  id: string;
  name: string;
  deleted: boolean;

  constructor(synonym: BotEntitySynonym) {
    this.id = synonym.id;
    this.name = synonym.name;
    this.deleted = synonym.deleted;
  }
}

class BotEntityOption {
  id: string;
  name: string;
  deleted: boolean;
  synonyms: BotEntitySynonym[];

  constructor(option: BotEntityOption) {
    this.id = option.id;
    this.name = option.name;
    this.deleted = option.deleted;
    this.synonyms = option.synonyms.map((synonym) => new BotEntitySynonym(synonym));
  }
}

export class BotEntity {
  id?: string;
  name: string;
  deleted?: boolean;
  options: BotEntityOption[];

  constructor(entity: BotEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.deleted = entity.deleted;
    this.options = entity.options.map((option) => new BotEntityOption(option));
  }
}
