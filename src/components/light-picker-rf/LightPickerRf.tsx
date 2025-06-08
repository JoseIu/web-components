import { Component, Element, h, Prop, State } from '@stencil/core';
import Lightpick from 'lightpick';
import moment from 'moment';

@Component({
  tag: 'light-picker-rf',
  styleUrl: './light-picker-rf.css',
  shadow: false,
})
export class LightPickerRf {
  @Element() hostElement: HTMLElement;
  private picker: Lightpick;
  private departureInput!: HTMLInputElement;
  private returnInput!: HTMLInputElement;
  private calendarContainer!: HTMLDivElement;
  private navigationObserver!: MutationObserver;
  private debounceTimer: any;
  private lastLoadedRange: string = '';

  @Prop() locale: string = 'es';

  @State() prices: { [date: string]: number } = {};
  @State() isLoading: boolean = false;
  @State() tripType: 'one-way' | 'round-trip' = 'round-trip';
  @State() departureDate: string = '';
  @State() returnDate: string = '';

  componentWillLoad() {
    this.isLoading = false;
  }

  async componentDidLoad() {
    await this.loadInitialPrices();
    this.initializePicker();
    this.setupEventListeners();
  }
  disconnectedCallback() {
    if (this.navigationObserver) {
      this.navigationObserver.disconnect();
    }
  }
  private setupEventListeners() {
    // Delegación de eventos para clicks en botones de navegación
    this.calendarContainer.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      const isNavButton = target.closest('.lightpick__previous-action, .lightpick__next-action');

      if (isNavButton) {
        this.debouncedLoadPrices();
      }
    });

    // También podrías agregar para cambios con teclado si es necesario
    this.calendarContainer.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        this.debouncedLoadPrices();
      }
    });
  }

  private async loadInitialPrices() {
    const startDate = moment();
    const endDate = moment().add(4, 'months');
    await this.getPrices(startDate, endDate);
  }

  private async getPrices(startDate: moment.Moment, endDate: moment.Moment) {
    console.log(`Cargando precios desde ${startDate.format('YYYY-MM-DD')} hasta ${endDate.format('YYYY-MM-DD')}`);
    const rangeKey = `${startDate.format('YYYY-MM-DD')}-${endDate.format('YYYY-MM-DD')}`;
    if (this.lastLoadedRange === rangeKey) return;
    this.lastLoadedRange = rangeKey;

    try {
      this.isLoading = true;
      await new Promise(resolve => setTimeout(resolve, 300));

      const newPrices: { [date: string]: number } = {};
      const daysDiff = endDate.diff(startDate, 'days');

      for (let i = 0; i <= daysDiff; i++) {
        const date = startDate.clone().add(i, 'days');
        const dateKey = date.format('YYYY-MM-DD');

        // Solo generamos precio si no existe ya
        if (!this.prices[dateKey]) {
          newPrices[dateKey] = Math.floor(Math.random() * (200 - 80 + 1)) + 80;
        }
      }

      this.prices = { ...this.prices, ...newPrices };
    } catch (error) {
      console.error('Error al obtener precios:', error);
    } finally {
      this.isLoading = false;
      this.updateCalendarPrices();
    }
  }

  private initializePicker() {
    this.picker = new Lightpick({
      field: this.departureInput,
      secondField: this.returnInput,
      singleDate: false,
      format: 'ddd, DD/MM/YY',
      lang: this.locale,
      numberOfMonths: 2,
      minDate: moment(),
      parentEl: this.calendarContainer,
      onOpen: () => {
        this.updateCalendarPrices();
        console.log('onOpen ');
      },
      onRender: () => {
        this.updateCalendarPrices();
        this.loadPricesForVisibleMonths();
        console.log('onRender ');
      },
      onSelect: (start, end) => {
        this.departureDate = start ? start.format('ddd, DD/MM/YY') : '';
        this.returnDate = end ? end.format('ddd, DD/MM/YY') : '';
        console.log('onSelect ');

        this.updateCalendarPrices();
      },
      onChangeView: () => {
        this.loadPricesForVisibleMonths();
        console.log('cambiando vista del calendario');
      },
    });
  }
  private debouncedLoadPrices() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.loadPricesForVisibleMonths();
    }, 100);
  }

  private async loadPricesForVisibleMonths() {
    const visibleMonths = this.calendarContainer.querySelectorAll('.lightpick__month');
    if (!visibleMonths.length) return;

    const firstDay = this.findFirstVisibleDay();
    const lastDay = this.fingLastVisibleDay();
    if (!firstDay || !lastDay) return;

    const startDate = moment(parseInt(firstDay.getAttribute('data-time')));
    const endDate = moment(parseInt(lastDay.getAttribute('data-time')));

    const bufferStart = startDate.clone().subtract(1, 'month');
    const bufferEnd = endDate.clone().add(1, 'month');

    await this.getPrices(bufferStart, bufferEnd);
  }

  private findFirstVisibleDay(): HTMLElement | null {
    const firstMonth = this.calendarContainer.querySelector('.lightpick__month');

    if (!firstMonth) return null;
    return firstMonth.querySelector('.lightpick__day:not(.is-disabled)') as HTMLElement;
  }

  private fingLastVisibleDay(): HTMLElement | null {
    const months = this.calendarContainer.querySelectorAll('.lightpick__month');
    const lastMonth = months[months.length - 1];
    const days = lastMonth.querySelectorAll('.lightpick__day:not(.is-disabled)');
    return days.length > 0 ? (days[days.length - 1] as HTMLElement) : null;
  }

  private updateCalendarPrices() {
    if (this.isLoading) return;

    requestAnimationFrame(() => {
      const days = this.calendarContainer.querySelectorAll('.lightpick__day:not(.is-disabled)');

      days.forEach(day => {
        const time = day.getAttribute('data-time');
        if (!time) return;

        const date = moment(parseInt(time));
        const dateKey = date.format('YYYY-MM-DD');
        const price = this.prices[dateKey];

        // Eliminar precio existente solo si vamos a actualizarlo
        const existingPrice = day.querySelector('span.day-price');
        if (existingPrice) day.removeChild(existingPrice);

        // Mostrar precio si existe
        if (price) {
          const priceEl = document.createElement('span');
          priceEl.className = 'day-price';
          priceEl.textContent = `$${price}`;
          day.appendChild(priceEl);
        }
      });
    });
  }

  private toggleTripType() {
    this.tripType = this.tripType === 'round-trip' ? 'one-way' : 'round-trip';
    this.picker.updateOptions({
      singleDate: this.tripType === 'one-way',
      secondField: this.tripType === 'round-trip' ? this.returnInput : null,
    });

    if (this.tripType === 'one-way') {
      this.returnDate = '';
    }
  }

  render() {
    return (
      <div class="date-picker-container">
        <div class="trip-type-toggle" onClick={() => this.toggleTripType()}>
          {this.tripType === 'round-trip' ? 'Viaje de ida y vuelta' : 'Viaje solo ida'}
        </div>

        <div class="input-fields">
          <div class="input-group">
            <label>FECHA IDA</label>
            <input ref={el => (this.departureInput = el as HTMLInputElement)} class="date-input" value={this.departureDate} readonly placeholder="Seleccione fecha" />
          </div>

          {this.tripType === 'round-trip' && (
            <div class="input-group">
              <label>FECHA VUELTA</label>
              <input ref={el => (this.returnInput = el as HTMLInputElement)} class="date-input" value={this.returnDate} readonly placeholder="Seleccione fecha" />
            </div>
          )}
        </div>
        <div ref={el => (this.calendarContainer = el)} class="calendar-container"></div>

        <button class="accept-button">Aceptar</button>
      </div>
    );
  }
}
