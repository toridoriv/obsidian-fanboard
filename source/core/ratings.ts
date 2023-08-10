import "../globals.ts";

import { z } from "../deps.ts";
import { TextUtilities } from "../utilities/text.ts";
import { Entities, Entity, EntityValidator } from "./entities.ts";

export namespace Ratings {
  let { required, min_length, gte, lte } =
    FanboardPlugin.Literals.common.validation_error;

  min_length = TextUtilities.replacePlaceholder(min_length, { min_length: "3" });
  gte = TextUtilities.replacePlaceholder(gte, { min_value: "0" });
  lte = TextUtilities.replacePlaceholder(lte, { max_value: "5" });

  export const RatingsSchema = Entities.BaseSchema.extend({
    name: z.string({ required_error: required }).trim().min(3, min_length),
    description: z.string().trim().default(""),
    level: z.coerce.number().int().min(1, gte).max(5, lte).default(1),
  });

  export type Input = z.input<typeof RatingsSchema>;
  export type Properties = z.infer<typeof RatingsSchema>;

  export const Validator = new EntityValidator<Properties>(RatingsSchema);
}

export interface Rating extends Ratings.Properties {}

export class Rating extends Entity {
  static validator = Ratings.Validator;

  constructor(properties: Ratings.Input) {
    super(Ratings.RatingsSchema, properties);
  }
}
