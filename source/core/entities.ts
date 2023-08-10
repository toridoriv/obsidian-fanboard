import { z } from "../deps.ts";
import { DateUtils, ObjectUtils } from "../utilities/main.ts";
import { Validation } from "./helpers.ts";

export namespace Entities {
  export const BaseSchema = z.object({
    id: z.string().trim().uuid().default(createUniqueId).catch(createUniqueId),
    createdAt: z.string().trim().datetime().default(createDateTime).catch(createDateTime),
    updatedAt: z.string().trim().datetime().default(createDateTime).catch(createDateTime),
  });

  export type BaseInput = z.input<typeof BaseSchema>;

  export type BaseProperties = z.infer<typeof BaseSchema>;

  function createUniqueId() {
    return crypto.randomUUID();
  }

  function createDateTime() {
    return DateUtils.createTimestamp();
  }
}

export namespace EntityValidator {
  export type Validate<T, U = Omit<T, keyof Entities.BaseProperties>> = {
    [K in keyof U]: Validation.ValidateFunction<U[K]>;
  };

  export interface Schema<T> extends z.ZodTypeAny {
    readonly shape: {
      [K in keyof T]: z.ZodTypeAny;
    };
  }

  export type Property<T> = Exclude<keyof T, keyof Entities.BaseProperties>;
}

export class EntityValidator<T extends Entities.BaseProperties> {
  readonly schema: EntityValidator.Schema<T>;
  private properties!: EntityValidator.Property<T>[];
  public validate: EntityValidator.Validate<T>;

  constructor(schema: EntityValidator.Schema<T>) {
    this.schema = schema;
    this.setProperties();
    const getter = this.getHandler();

    this.validate = new Proxy(
      {},
      { get: getter as SafeAny },
    ) as EntityValidator.Validate<T>;

    ObjectUtils.makePropertyNonEnumerable(this, "schema");
  }

  private getHandler() {
    const isValidProperty = this.isValidProperty.bind(this);

    return (_: unknown, property: EntityValidator.Property<T>) => {
      if (isValidProperty(property)) {
        return Validation.run.bind(null, this.schema.shape[property]);
      }
    };
  }

  private isValidProperty(property: EntityValidator.Property<T>) {
    return this.properties.includes(property);
  }

  private setProperties() {
    const keys = Object.keys(this.schema.shape);
    const exclude = Object.keys(Entities.BaseSchema.shape);

    Object.assign(this, { properties: keys.filter((k) => !exclude.includes(k)) });
  }
}

export namespace EntityErrors {
  export class BaseError extends Error {
    constructor(message: string, entity?: string) {
      super(message);

      this.setName(entity);
    }

    private setName(entity?: string) {
      this.name = entity ? `${entity}${this.constructor.name}` : this.constructor.name;
    }
  }

  export class NotImplementedError extends BaseError {
    constructor(entity: string, method: string) {
      const message = `${entity}.prototype.${method}() was not implemented.`;
      super(message);
    }
  }

  export class StaticNotImplementedError extends BaseError {
    constructor(entity: string, method: string) {
      const message = `${entity}.${method}() was not implemented.`;
      super(message);
    }
  }

  export class StaticPropertyNotDefined extends BaseError {
    constructor(entity: string, property: string) {
      const message = `Property ${entity}.${property} was not defined.`;
      super(message);
    }
  }

  export class ValidationErrors extends BaseError {
    private static separator = "\n\t-";
    public issues: string[];

    constructor(entity: string, issues: string[]) {
      const message = `${ValidationErrors.separator} ${
        issues.join(
          `${ValidationErrors.separator} `,
        )
      }`;
      super(message, entity);

      this.issues = issues;
    }
  }
}

export abstract class Entity {
  static get description(): string {
    throw new EntityErrors.StaticPropertyNotDefined(this.name, "description");
  }

  static get validator(): EntityValidator<SafeAny> {
    throw new EntityErrors.StaticNotImplementedError(this.name, "validator");
  }

  constructor(schema: EntityValidator.Schema<SafeAny>, properties: unknown) {
    const validation = Validation.run(schema, properties);

    if (!validation.success) {
      throw new EntityErrors.ValidationErrors(this.constructor.name, validation.issues);
    }

    Object.assign(this, validation.data);
  }
}
