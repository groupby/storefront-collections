import { Component, Events } from '@storefront/core';
import Collections from '../../src/collections';
import suite from './_suite';

suite('Collections', ({ expect, spy }) => {

  describe('constructor()', () => {
    afterEach(() => delete Component.prototype.flux);

    it('should register for COLLECTION_UPDATED event', () => {
      const on = spy();
      const flux = Component.prototype.flux = <any>{ on };

      const collections = new Collections();

      expect(on.calledWith(Events.COLLECTION_UPDATED, collections.updateCollections)).to.be.true;
    });

    describe('state', () => {
      describe('onSelect()', () => {
        it('should call flux.switchCollection()');
      });
    });
  });

  describe('actions', () => {
    let collections: Collections;

    beforeEach(() => {
      Component.prototype.flux = <any>{ on: () => null };
      collections = new Collections();
    });
    afterEach(() => delete Component.prototype.flux);

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
});
