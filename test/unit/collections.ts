import { Component, Events } from '@storefront/core';
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
    it('should register for COLLECTION_UPDATED event', () => {
      const on = spy();
      collections.flux = <any>{ on };
      collections.services = <any>{ collections: { register: () => null } };

      collections.init();

      expect(on.calledWith(Events.COLLECTION_UPDATED, collections.updateCollectionTotal)).to.be.true;
    });

    it('should register with collections service', () => {
      const register = spy();
      collections.flux = <any>{ on: () => null };
      collections.services = <any>{ collections: { register } };

      collections.init();

      expect(register.calledWith(collections)).to.be.true;
    });
  });

  describe('onBeforeMount()', () => {
    it('should update state', () => {
      const state = { a: 'b' };
      const collectionList = ['e', 'f'];
      const selectCollections = collections.selectCollections = spy(() => collectionList);
      collections.flux = <any>{ store: { getState: () => state } };
      collections.expose = () => null;
      collections.state = <any>{ c: 'd' };

      collections.onBeforeMount();

      expect(selectCollections.calledWith(state)).to.be.true;
      expect(collections.state).to.eql({ c: 'd', collections: collectionList });
    });

    it('should call expose()', () => {
      const expose = collections.expose = spy();
      collections.selectCollections = spy();
      collections.flux = <any>{ store: { getState: () => null } };

      collections.onBeforeMount();

      expect(expose.calledWith('collections')).to.be.true;
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

  describe('selectCollection()', () => {
    it('should map to options', () => {
      const collectionState = {
        allIds: ['a', 'b', 'c'],
        byIds: { a: {}, b: {}, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: {} };

      const options = collections.selectCollections(<any>{ data: { collections: collectionState } });

      expect(options).to.eql([
        { value: 'a', label: 'a', selected: false },
        { value: 'b', label: 'b', selected: true },
        { value: 'c', label: 'c', selected: false }
      ]);
    });

    it('should allow overriding labels', () => {
      const collectionState = {
        allIds: ['a', 'b', 'c'],
        byIds: { a: {}, b: {}, c: {} },
        selected: 'b'
      };
      collections.props = <any>{ labels: { a: 'A', b: 'B', c: 'C' } };

      const options = collections.selectCollections(<any>{ data: { collections: collectionState } });

      expect(options).to.eql([
        { value: 'a', label: 'A', selected: false },
        { value: 'b', label: 'B', selected: true },
        { value: 'c', label: 'C', selected: false }
      ]);
    });
  });
});
