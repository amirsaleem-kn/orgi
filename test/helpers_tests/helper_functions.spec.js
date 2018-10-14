// import test libraries
const { expect, assert, should } = require('chai');

// module to test
const helper_functions = require('../../lib/common/helper_functions.js');
const { base64_encode, base64_decode } = helper_functions;

describe('Helper Functions', function () {
    describe('base64_encode method', function(){
        it('should return null when no argument is passed', function(){
            expect(base64_encode()).to.equal(null);
        });
        it('should work fine with array', function(){
            expect(base64_encode([])).to.equal('IiI=');
        });
        it('should work fine with object', function(){
            expect(base64_encode({})).to.equal('Int9Ig==');
        });
        it('should work fine with integer', function(){
            expect(base64_encode(500)).to.equal('IjUwMCI=');
        });
        it('should work fine with string', function(){
            expect(base64_encode('test')).to.equal('InRlc3Qi');
        });
        it('should work fine with json', function(){
            expect(base64_encode(JSON.stringify({ some: "object" }))).to.equal('IntcInNvbWVcIjpcIm9iamVjdFwifSI=');
        });
        it('should work fine with floats', function(){
            expect(base64_encode(3.14)).to.equal('IjMuMTQi');
        });
    });
    describe('base64_decode method', function(){
        it('should return null when no argument is passed', function(){
            expect(base64_encode()).to.equal(null);
        });
        it('should return InRlc3Qi= when test is passed', function(){
            expect(base64_decode('InRlc3Qi=')).to.equal('"test"');
        });
    });
});