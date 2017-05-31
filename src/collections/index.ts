import { tag, Events, Store, Tag } from '@storefront/core';

@tag('gb-collections', require('./index.html'), [
  { name: 'labels', default: {} }
])
class Collections {

  state: Collections.State = {
    collections: [],
    onSelect: (index) => this.flux.switchCollection(this.state.collections[index].value)
  };

  init() {
    this.flux.on(Events.COLLECTION_UPDATED, this.updateCollection);
    this.services.collections.register(this);
  }

  onBeforeMount() {
    this.state = {
      ...this.state,
      collections: this.selectCollections(this.flux.store.getState())
    };
    this.expose('collections');
  }

  updateCollection = ({ name, total }: Store.Collection) => {
    const index = this.flux.store.getState()
      .data.collections.allIds.indexOf(name);
    const collections = this.state.collections.slice();

    collections.splice(index, 1, { ...this.state.collections[index], total });
    this.set({ collections });
  }

  selectCollections({ data: { collections } }: Store.State) {
    return collections.allIds.map((collection) => ({
      value: collection,
      label: this.props.labels[collection] || collection,
      selected: collections.selected === collection
    }));
  }
}

interface Collections extends Tag<Collections.Props, Collections.State> { }
namespace Collections {
  export interface Props {
    labels: { [collection: string]: string };
  }

  export interface State {
    collections: Option[];
    onSelect(index: number): void;
  }

  export interface Option {
    value: string;
    label: string;
    selected?: boolean;
  }
}

export default Collections;
