'use strict';

const test = require('tape');
const nock = require('nock');
const path = require('path');

const dp = require('../');

test('Download library function', assert => {

  assert.equal(typeof dp, 'function',
      'should be a function');

  assert.end();

});

test('Download mixed invalid list', assert => {

  assert.plan(1);

  dp(path.normalize('./downloads'),
    ['test.tgz', 'wordify', 'asdfsd', 'elasticsearch-synonyms'])
    .then(result => {
      assert.equal(typeof result, 'object',
          'should return an object');

      assert.end();

    });

});

test('Download invalid npm module', assert => {

  assert.plan(3);

  dp(path.normalize('./downloads'),
    ['asdfsd'])
    .then(result => {

      assert.equal(typeof result, 'object',
          'should return an object');
      assert.ok(result.success.length === 0, true, 'Success array should be 0');
      assert.ok(result.errors.length === 1, true, 'Errors array should be 1');

      assert.end();

    });

});
