import { Gif } from '../interfaces/gif.interface';
import { GifItem } from '../interfaces/giphy.interface';

export class GifMapper {
  static mapGiphyItemToGif(gifItem: GifItem): Gif {
    return {
      id: gifItem.id,
      title: gifItem.title,
      url: gifItem.images.original.url,
    };
  }
  static mapGiphyItemsToGifs(gifItems: GifItem[]): Gif[] {
    return gifItems.map(gifItem => this.mapGiphyItemToGif(gifItem));
  }
}
