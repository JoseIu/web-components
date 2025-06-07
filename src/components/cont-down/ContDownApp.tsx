import { Component, h } from '@stencil/core';

@Component({
  tag: 'cont-down-app',
  styleUrl: './cont-down.css',
  shadow: true,
})
export class ContDownApp {
  render() {
    return (
      <div class="container">
        <h1>Countdown App</h1>
      </div>
    );
  }
}
