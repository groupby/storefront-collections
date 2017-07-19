import { Events } from '@storefront/core';
import Collections from '../../src/collections';
import suite from './_suite';

suite('Collections', ({ expect, spy, configurable, aliased }) => {
  let collections: Collections;

  beforeEach(() => collections = new Collections());

  configurable(Collections);
  aliased(Collections);

  describe('constructor()', () => {
    describe('props', () => {
      it('should have initial value', () => {
        expect(collections.props).to.eql({ labels: {} });
      });
    });

    describe('state', () => {
      it('should have initial value', () => {
        expect(collections.state.collections).to.eql([]);
      });

      describe('onSelect()', () => {
        it('should call actions.selectCollection()', () => {
          const collection = 'products';
          const selectCollection = spy();
          collections.state.collections = <any[]>[{ value: 'other' }, { value: collection }];
          collections.actions = <any>{ selectCollection };

          collections.state.onSelect(1);

          expect(selectCollection).to.be.calledWith(collection);
        });
      });
    });
  });

  describe('init()', () => {
    it('should call updateCollections()', () => {
      const updateCollections = collections.updateCollections = spy();
      collections.flux = <any>{ on: () => null };
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(updateCollections).to.be.called;
    });

    it('should register for COLLECTION_UPDATED event', () => {
      const on = spy();
      collections.flux = <any>{ on };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(on).to.be.calledWith(Events.COLLECTION_UPDATED, collections.updateCollectionTotal);
    });

    it('should register for SELECTED_COLLECTION_UPDATED event', () => {
      const on = spy();
      collections.flux = <any>{ on };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(on).to.be.calledWith(Events.SELECTED_COLLECTION_UPDATED, collections.updateCollections);
    });

    it('should register with collections service', () => {
      const register = spy();
      collections.flux = <any>{ on: () => null };
      collections.updateCollections = () => null;
      collections.services = <any>{ collections: { register } };

      collections.init();

      expect(register).to.be.calledWith(collections);
    });
  });

  describe('updateCollections()', () => {
    it('should set collections', () => {
      const state = { a: 'b' };
      const newCollections = ['c', 'd'];
      const set = collections.set = spy();
      const selectCollections = collections.selectCollections = spy(() => newCollections);
      collections.flux = <any>{ store: { getState: () => state } };

      collections.updateCollections();

      expect(selectCollections).to.be.calledWith(state);
      expect(set).to.be.calledWith({ collections: newCollections });
    });
  });

  describe('updateCollectionTotal()', () => {
    it('should update collection total', () => {
      const allIds = ['a', 'b', 'c'];
      const set = collections.set = spy();
      collections.flux = <any>{ store: { getState: () => ({ data: { collections: { allIds } } }) } };
      collections.state = <any>{ collections: [{ d: 'e' }, { f: 'g' }, { h: 'i' }] };

      collections.updateCollectionTotal({ name: 'b', total: 50 });

      expect(set).to.be.calledWith({ collections: [{ d: 'e' }, { f: 'g', total: 50 }, { h: 'i' }] });
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
