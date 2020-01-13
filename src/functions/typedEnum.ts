import { isArray } from 'lodash';
import { IFunction, IFunctionResult, IRule, RuleFunction } from '../types';
import { schema } from './schema';

export type TypedEnumRule = IRule<RuleFunction.TYPED_ENUM>;

export const typedEnum: IFunction = (targetVal, opts, paths, otherValues): void | IFunctionResult[] => {
  const { enum: enumValues, ...initialSchema } = targetVal;

  if (!isArray(enumValues)) {
    return;
  }

  const innerSchema = { type: initialSchema.type, enum: initialSchema.enum };
  const schemaObject = { schema: innerSchema };

  const incorrectValues: unknown[] = [];

  for (const val of enumValues) {
    const res = schema(val, schemaObject, paths, otherValues);

    if (res === undefined || res.length === 0) {
      continue;
    }

    incorrectValues.push(val);
  }

  if (incorrectValues.length === 0) {
    return;
  }

  const { type } = initialSchema;

  return incorrectValues.map(val => {
    return {
      message: `Enum value "${val}" do not respect the specified type "${type}".`,
    };
  });
};
