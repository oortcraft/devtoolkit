import { describe, it, expect } from 'vitest';
import { convertCase } from '../src/lib/case-converter-utils';

describe('convertCase - empty input', () => {
  it('returns empty string for empty input', () => {
    expect(convertCase('', 'camelCase')).toEqual({ result: '' });
  });

  it('returns empty string for whitespace-only input', () => {
    expect(convertCase('   ', 'snake_case')).toEqual({ result: '' });
  });
});

describe('convertCase - camelCase', () => {
  it('converts snake_case to camelCase', () => {
    expect(convertCase('hello_world', 'camelCase')).toEqual({ result: 'helloWorld' });
  });

  it('converts kebab-case to camelCase', () => {
    expect(convertCase('my-variable-name', 'camelCase')).toEqual({ result: 'myVariableName' });
  });

  it('converts space-separated words to camelCase', () => {
    expect(convertCase('hello world foo', 'camelCase')).toEqual({ result: 'helloWorldFoo' });
  });
});

describe('convertCase - PascalCase', () => {
  it('converts snake_case to PascalCase', () => {
    expect(convertCase('hello_world', 'PascalCase')).toEqual({ result: 'HelloWorld' });
  });
});

describe('convertCase - snake_case', () => {
  it('converts camelCase to snake_case', () => {
    expect(convertCase('helloWorld', 'snake_case')).toEqual({ result: 'hello_world' });
  });
});

describe('convertCase - SCREAMING_SNAKE', () => {
  it('converts kebab-case to SCREAMING_SNAKE', () => {
    expect(convertCase('hello-world', 'SCREAMING_SNAKE')).toEqual({ result: 'HELLO_WORLD' });
  });
});

describe('convertCase - kebab-case', () => {
  it('converts PascalCase to kebab-case', () => {
    expect(convertCase('HelloWorld', 'kebab-case')).toEqual({ result: 'hello-world' });
  });
});

describe('convertCase - Title Case', () => {
  it('converts snake_case to Title Case', () => {
    expect(convertCase('hello_world', 'Title Case')).toEqual({ result: 'Hello World' });
  });
});

describe('convertCase - UPPERCASE', () => {
  it('converts to all uppercase including symbols', () => {
    expect(convertCase('hello world', 'UPPERCASE')).toEqual({ result: 'HELLO WORLD' });
  });
});

describe('convertCase - lowercase', () => {
  it('converts to all lowercase', () => {
    expect(convertCase('HELLO WORLD', 'lowercase')).toEqual({ result: 'hello world' });
  });
});
