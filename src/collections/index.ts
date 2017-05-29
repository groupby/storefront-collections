import { view, Component, Events, Store } from '@storefront/core';

@view('gb-collections', require('./index.html'), [
  { name: 'labels', default: {} }
])
class Collections extends Component {

  props: Collections.Props;
  state: Collections.State = {
    collections: [],
    onSelect: (index) => this.flux.switchCollection(this.state.collections[index].value)
  };

  constructor() {
    super();
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

namespace Collections {
  export interface Props {
    labels: { [collection: string]: string };
  }
  export interface State {
    collections: Array<{ value: string, label: string, selected?: boolean }>;
    onSelect(index: number): void;
  }
}

export default Collections;
