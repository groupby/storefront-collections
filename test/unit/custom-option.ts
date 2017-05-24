import CustomOption from '../../src/custom-option';
import suite from './_suite';

suite('CustomOption', ({ expect }) => {

  describe('constructor()', () => {
    it('should be ok', () => {
      expect(new CustomOption()).to.be.ok;
    });
  });
});
