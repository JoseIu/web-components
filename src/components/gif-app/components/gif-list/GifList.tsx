import { Component, h, Prop } from '@stencil/core';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  tag: 'gif-list',
  styleUrl: './gif-list.css',
  shadow: true,
})
export class GifList {
  @Prop() gifs: Gif[] = [];
  // @Prop() loading: boolean = false;
  render() {
    return (
      <div class="gif-list">
        {this.gifs.map(gif => (
          <article class="gif-list__item">
            <img class="gif-list__image" src={gif.url} alt={gif.title} />
            <h2 class="gif-list__title">{gif.title}</h2>
          </article>
        ))}
      </div>
    );
  }
}
