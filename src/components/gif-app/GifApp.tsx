import { Component, h, Listen, State } from '@stencil/core';
import { Gif } from './interfaces/gif.interface';
import { GiphyResponse } from './interfaces/giphy.interface';
import { GifMapper } from './mapper/gif.mapper';
import { getGifFromStorage } from './utils/getGifFromStorage';
const API_URL = import.meta.env.API_URL;
const API_KEY = import.meta.env.API_KEY;
@Component({
  tag: 'gif-app',
  styleUrl: './gif-app.css',
  shadow: true,
})
export class GifApp {
  @State() gifs: Gif[] = [];

  connectedCallback() {
    this.gifs = getGifFromStorage();
  }
  @Listen('search', { target: 'document' }) async searchHandler(event: CustomEvent<string>) {
    try {
      const response = await fetch(`${API_URL}/v1/gifs/search?api_key=${API_KEY}&q=${event.detail}&limit=20`);

      const { data } = (await response.json()) as GiphyResponse;
      const gifs = GifMapper.mapGiphyItemsToGifs(data);
      this.gifs = gifs;
      this.saveGifsToLocalStorage(gifs);
    } catch (error) {
      console.log(error.message);
    }
  }

  saveGifsToLocalStorage(gifs: Gif[]) {
    localStorage.setItem('gifs', JSON.stringify(gifs));
  }
  render() {
    return (
      <>
        <search-gif />
        <gif-list gifs={this.gifs} />
      </>
    );
  }
}
