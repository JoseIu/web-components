import { Gif } from '../interfaces/gif.interface';

export const getGifFromStorage = (): Gif[] => {
  const gifs = localStorage.getItem('gifs');
  return gifs ? JSON.parse(gifs) : [];
};
