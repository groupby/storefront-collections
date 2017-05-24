import * as pkg from '../../src';
import Collections from '../../src/collections';
import CustomOption from '../../src/custom-option';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Collections', () => {
    expect(pkg.Collections).to.eq(Collections);
  });

  it('should expose CustomOption', () => {
    expect(pkg.CustomOption).to.eq(CustomOption);
  });
});
