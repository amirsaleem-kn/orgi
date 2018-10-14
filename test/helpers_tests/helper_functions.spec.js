// import test libraries
const { expect, assert, should } = require('chai');

// module to test
const helper_functions = require('../../lib/common/helper_functions.js');
const { base64_encode, base64_decode, cast_float } = helper_functions;

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
    describe('cast_float method', function(){
        it('should return 0 when no argument is passed', function(){
            expect(cast_float()).to.equal(0);
        });
        it('should return 0 when any non number data type is passed except string containing numbers', function(){
            expect(cast_float('some string')).to.equal(0);
            expect(cast_float({})).to.equal(0);
            expect(cast_float([])).to.equal(0);
            expect(cast_float(NaN)).to.equal(0);
            expect(cast_float(null)).to.equal(0);
            expect(cast_float(undefined)).to.equal(0);
        });
        it('should return a number when string integer is passed', function(){
            assert.typeOf(cast_float('5'), 'number');
            expect(cast_float('5')).to.equal(5);
        });
        it('should return a number when string float is passed', function(){
            assert.typeOf(cast_float('4.55'), 'number');
            expect(cast_float('4.55')).to.equal(4.55);
        });
    });
});