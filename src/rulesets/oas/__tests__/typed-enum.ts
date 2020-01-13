import { typedEnum } from '../../../functions/typedEnum';
import { RuleType, Spectral } from '../../../index';
import { rules } from '../index.json';

describe('typed-enum', () => {
  const s = new Spectral();
  s.setFunctions({ typedEnum });
  s.setRules({
    'typed-enum': Object.assign(rules['typed-enum'], {
      recommended: true,
      type: RuleType[rules['typed-enum'].type],
    }),
  });

  describe('oas2', () => {
    test('does not report anything for empty object', async () => {
      const results = await s.run({
        swagger: '2.0',
      });

      expect(results).toEqual([]);
    });

    test('does not report anything when the model valid', async () => {
      const doc = {
        swagger: '2.0',
        definitions: {
          Test: {
            type: 'integer',
            enum: [1, 2, 3],
          },
        },
      };

      const results = await s.run(doc);

      expect(results).toEqual([]);
    });

    test('identifies enum values which do not respect the type', async () => {
      const doc = {
        swagger: '2.0',
        definitions: {
          Test: {
            type: 'integer',
            enum: [1, 'a string!', 3, 'and another one!'],
          },
        },
      };

      const results = await s.run(doc);

      expect(results).toEqual([
        {
          code: 'typed-enum',
          message: 'Enum value "a string!" do not respect the specified type "integer".',
          path: ['definitions', 'Test'],
          range: {
            start: {
              character: 11,
              line: 3,
            },
            end: {
              character: 26,
              line: 9,
            },
          },
          severity: 1,
        },
        {
          code: 'typed-enum',
          message: 'Enum value "and another one!" do not respect the specified type "integer".',
          path: ['definitions', 'Test'],
          range: {
            start: {
              character: 11,
              line: 3,
            },
            end: {
              character: 26,
              line: 9,
            },
          },
          severity: 1,
        },
      ]);
    });
  });

  describe('oas3', () => {
    test('does not report anything for empty object', async () => {
      const results = await s.run({
        openapi: '3.0.0',
      });

      expect(results).toEqual([]);
    });

    test('does not report anything when the model is valid', async () => {
      const doc = {
        openapi: '3.0.0',
        components: {
          schemas: {
            Test: {
              type: 'integer',
              enum: [1, 2, 3],
            },
          },
        },
      };

      const results = await s.run(doc);

      expect(results).toEqual([]);
    });

    test('identifies enum values which do not respect the type', async () => {
      const doc = {
        openapi: '3.0.0',
        components: {
          schemas: {
            Test: {
              type: 'integer',
              enum: [1, 'a string!', 3, 'and another one!'],
            },
          },
        },
      };

      const results = await s.run(doc);

      expect(results).toEqual([
        {
          code: 'typed-enum',
          message: 'Enum value "a string!" do not respect the specified type "integer".',
          path: ['components', 'schemas', 'Test'],
          range: {
            start: {
              character: 13,
              line: 4,
            },
            end: {
              character: 28,
              line: 10,
            },
          },
          severity: 1,
        },
        {
          code: 'typed-enum',
          message: 'Enum value "and another one!" do not respect the specified type "integer".',
          path: ['components', 'schemas', 'Test'],
          range: {
            start: {
              character: 13,
              line: 4,
            },
            end: {
              character: 28,
              line: 10,
            },
          },
          severity: 1,
        },
      ]);
    });
  });
});
