import { Component, Event, EventEmitter, h, State } from '@stencil/core';

@Component({
  tag: 'search-gif',
  styleUrl: './search-gif.css',
  shadow: true,
})
export class SearchGif {
  @State() searchTerm: string = '';

  @Event({
    eventName: 'search',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  onSearch: EventEmitter<string>;

  onHandleSearch(event: Event) {
    const inputValue = event.target as HTMLInputElement;
    if (!inputValue.value) return;
    this.searchTerm = inputValue.value;
  }
  onHandleSubmit() {
    this.onSearch.emit(this.searchTerm);
  }

  render() {
    return (
      <div class="search-gif">
        <input class="search-gif__input" type="search" name="search" id="search" onChange={event => this.onHandleSearch(event)} />
        <button class="search-gif__button" onClick={() => this.onHandleSubmit()}>
          Search
        </button>
      </div>
    );
  }
}
