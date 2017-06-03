import { Events } from '@storefront/core';
import Collections from '../../src/collections';
import suite from './_suite';

suite('Collections', ({ expect, spy }) => {
  let collections: Collections;

  beforeEach(() => collections = new Collections());

  describe('constructor()', () => {
    describe('state', () => {
      describe('onSelect()', () => {
        it('should call flux.switchCollection()');
      });
    });
  });

  describe('init()', () => {
    it('should call updateCollections()', () => {
      const updateCollections = collections.updateCollections = spy();
      collections.flux = <any>{ on: () => null };
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(updateCollections.called).to.be.true;
    });

    it('should register for COLLECTION_UPDATED event', () => {
      const on = spy();
      collections.flux = <any>{ on };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(on.calledWith(Events.COLLECTION_UPDATED, collections.updateCollectionTotal)).to.be.true;
    });

    it('should register for SELECTED_COLLECTION_UPDATED event', () => {
      const on = spy();
      collections.flux = <any>{ on };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(on.calledWith(Events.SELECTED_COLLECTION_UPDATED, collections.updateCollections)).to.be.true;
    });

    it('should register with collections service', () => {
      const register = spy();
      collections.flux = <any>{ on: () => null };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register } };

      collections.init();

      expect(register.calledWith(collections)).to.be.true;
    });
  });

  describe('updateCollection()', () => {
    it('should update collection total', () => {
      const allIds = ['a', 'b', 'c'];
      const set = collections.set = spy();
      collections.flux = <any>{ store: { getState: () => ({ data: { collections: { allIds } } }) } };
      collections.state = <any>{ collections: [{ d: 'e' }, { f: 'g' }, { h: 'i' }] };

      collections.updateCollectionTotal({ name: 'b', total: 50 });

      expect(set.calledWith({ collections: [{ d: 'e' }, { f: 'g', total: 50 }, { h: 'i' }] })).to.be.true;
    });
  });

  describe('selectCollections()', () => {
    it('should map to options', () => {
      const collectionState = {
        allIds: ['a', 'b', 'c'],
        byId: { a: {}, b: { total: 4 }, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: {} };

      const options = collections.selectCollections(<any>{ data: { collections: collectionState } });

      expect(options).to.eql([
        { value: 'a', label: 'a', selected: false, total: undefined },
        { value: 'b', label: 'b', selected: true, total: 4 },
        { value: 'c', label: 'c', selected: false, total: undefined }
      ]);
    });

    it('should allow overriding labels', () => {
      const collectionState = {
        allIds: ['a', 'b', 'c'],
        byId: { a: {}, b: {}, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: { a: 'A', b: 'B', c: 'C' } };

      const options = collections.selectCollections(<any>{ data: { collections: collectionState } });

      expect(options).to.eql([
        { value: 'a', label: 'A', selected: false, total: undefined },
        { value: 'b', label: 'B', selected: true, total: undefined },
        { value: 'c', label: 'C', selected: false, total: undefined }
      ]);
    });
  });
});
