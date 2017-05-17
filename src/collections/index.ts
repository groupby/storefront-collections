import { view, Component, Events, Store } from '@storefront/core';

@view('gb-collections', require('./index.html'), require('./index.css'), [
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
    this.expose('collections');
    this.flux.on(Events.COLLECTION_UPDATED, this.updateCollections);
  }

  updateCollections = (collection: Store.Indexed.Selectable<Store.Collection>) =>
    console.log('got a collection', collection)

  selectCollections({ data: { collections } }: Store.State) {
    return collections.allIds.map((collection) => ({
      value: collection,
      label: this.props.labels[collection] || collection,
      selected: collection === collections.selected
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
