'use strict';

const assert = require('assert');
const mm = require('mm');
const {
  parsePackageName,
  // checkAliasConflict,
  getAliasPackageName,
} = require('../lib/alias');

describe('test/alias.test.js', () => {
  describe('parsePackageName', () => {
    it('should work when form of pkg is `name`', () => {
      const [
        aliasPackageName,
        realPackageName,
      ] = parsePackageName('chair');

      assert.strictEqual(aliasPackageName, undefined);
      assert.strictEqual(realPackageName, 'chair');
    });

    it('should work when form of pkg is `name@version`', () => {
      const [
        aliasPackageName,
        realPackageName,
      ] = parsePackageName('chair@release-1.5');

      assert.strictEqual(aliasPackageName, undefined);
      assert.strictEqual(realPackageName, 'chair@release-1.5');
    });

    it('should work when form of pkg is `alias@npm:name`', () => {
      const [
        aliasPackageName,
        realPackageName,
      ] = parsePackageName('chair-latest@npm:chair');

      assert.strictEqual(aliasPackageName, 'chair-latest');
      assert.strictEqual(realPackageName, 'chair');
    });

    it('should work when form of pkg is `alias@npm:name@version`', () => {
      const [
        aliasPackageName,
        realPackageName,
      ] = parsePackageName('chair-latest@npm:chair@release-1.5');

      assert.strictEqual(aliasPackageName, 'chair-latest');
      assert.strictEqual(realPackageName, 'chair@release-1.5');
    });

    it('should print wranings when form of pkg is `alias@npm:name@version`', () => {
      mm(console, 'warn', msg => {
        assert.strictEqual(msg, '[npminstall] alias name (chair_latest!!!) invalid for new packages. warnings: name can no longer contain special characters ("~\'!()*")');
      });
      const [
        aliasPackageName,
        realPackageName,
      ] = parsePackageName('chair_latest!!!@npm:chair@release-1.5');

      assert.strictEqual(aliasPackageName, 'chair_latest!!!');
      assert.strictEqual(realPackageName, 'chair@release-1.5');

      mm.restore();
    });

    it('should throw errors when form of pkg is `alias@npm:name@version`', () => {
      try {
        parsePackageName('__chair_latest@npm:chair@release-1.5');
      } catch (error) {
        assert.strictEqual(error.message, '[npminstall] alias name (__chair_latest) invalid. errors: name cannot start with an underscore');
      }
    });
  });

  describe('checkAliasConflict', () => {

  });

  describe('getAliasPackageName', () => {
    it('should work when alias is set', () => {
      const pkgName = getAliasPackageName('chair-deprecated', 'chair', '1.0');
      assert.strictEqual(pkgName, 'chair-deprecated@npm:chair@1.0');
    });

    it('should work when alias is not set', () => {
      const pkgName = getAliasPackageName(undefined, 'chair', '1.0');
      assert.strictEqual(pkgName, 'chair@1.0');
    });
  });
});
