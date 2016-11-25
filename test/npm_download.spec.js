'use strict';

const path = require('path');
const test = require('tape');
const nock = require('nock');
const rewire = require('rewire');
const mockSpawn = require('mock-spawn');
const through = require('through2');
const dp = rewire('../');

/**
 * Writestream mock
 */
function writeStreamHelper(cb) {

  let tr = through(write, end);
  let data = '';

  function write(buffer, encoding, next) {
    data += (buffer.toString());
    next();
  }

  function end(done) {
    cb(data);
    done();
  }

  return tr;

}

/**
 * spawn mock
 */
let localSpawn = mockSpawn();
dp.__set__('spawn', localSpawn);

test('npm-download library function', assert => {

  assert.equal(typeof dp, 'function', 'should be a function');
  assert.end();

});

test('npm-download invalid npm module', assert => {

  assert.plan(4);

  localSpawn.setStrategy(function (command, args, opts) {
    return function (cb) {
      this.stderr.write('404 could not find module');
      return cb(1);
    };
  });

  dp(path.normalize('./downloads'),
    ['asdfsd'])
    .then(result => {
      assert.equal(typeof result, 'object', 'should return an object');
      assert.ok(result.success.length === 0, true, 'should be no successes');
      assert.ok(result.errors.length === 1, true, 'should have one error');
      assert.ok(result.errors[0], '404 could not find module', 'should have one error');
      assert.end();
    });

});

test('npm-download npm module', assert => {

  assert.plan(4);

  let fileContents = '';
  let testwriter = writeStreamHelper(data => {
    fileContents = data;
  });

  let mockWordify = nock('http://example.com')
    .get('/module.tgz')
    .reply(200, 'my module');

  var fsMock = {
    createWriteStream: (path) => testwriter,
  };

  dp.__set__('fs', fsMock);

  dp(path.normalize('./downloads'), ['http://example.com/module.tgz'])
    .then(result => {
      assert.equal(typeof result, 'object', 'should return an object');
      assert.ok(result.success.length === 1, true, 'should have one success');
      assert.ok(result.errors.length === 0, false, 'should have no errors');
      assert.equal(fileContents, 'my module', 'should write file contents');
      assert.end();
    });

});
