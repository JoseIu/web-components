import { Component, h, Prop, State, Watch } from '@stencil/core';
import moment from 'moment';

@Component({
  tag: 'app-validate-input',
  styleUrl: './validateInput.css',
  shadow: false,
})
export class ValidateInputComponent {
  @Prop() label: string = 'Fecha de nacimiento';
  @Prop() lang: string = 'es';

  @State() error: string = '';
  @State() value: string = '';

  private debounceTimer: any;

  private messages = {
    es: {
      required: 'Este campo es obligatorio',
      format: 'Formato inválido. Usa DD/MM/AAAA',
      hint: 'Formato requerido: DD/MM/AAAA',
    },
    en: {
      required: 'This field is required',
      format: 'Invalid format. Use DD/MM/YYYY',
      hint: 'Required format: DD/MM/YYYY',
    },
  };

  private validate(value: string): string {
    const lang = this.lang === 'en' ? 'en' : 'es';
    const messages = this.messages[lang];

    if (!value.trim()) return messages.required;

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      return lang === 'es' ? 'El formato debe ser DD/MM/AAAA' : 'Format must be DD/MM/YYYY';
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) {
      return lang === 'es' ? 'El mes debe estar entre 01 y 12' : 'Month must be between 01 and 12';
    }

    if (day < 1 || day > 31) {
      return lang === 'es' ? 'El día debe estar entre 01 y 31' : 'Day must be between 01 and 31';
    }

    // Validar que el día exista en el mes (ej: 30/02 no es válido)
    const date = moment(value, 'DD/MM/YYYY', true);
    if (!date.isValid()) {
      return lang === 'es' ? 'La fecha no es válida para ese mes' : 'The date is not valid for that month';
    }

    return ''; // Todo bien
  }

  private handleInput(event: InputEvent) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.error = this.validate(inputValue);
    }, 300);
  }

  @Watch('lang')
  langChanged() {
    if (this.value) {
      this.error = this.validate(this.value);
    }
  }

  render() {
    const id = 'date-input';
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    return (
      <div class="form-group">
        <label htmlFor={id}>{this.label}</label>
        <input
          class="form-input"
          id={id}
          type="text"
          placeholder="DD/MM/AAAA"
          value={this.value}
          onInput={e => this.handleInput(e)}
          aria-describedby={`${hintId} ${errorId}`}
          aria-invalid={!!this.error}
          required
        />
        <span id={hintId} class="sr-only">
          {this.messages[this.lang].hint}
        </span>
        {this.error && (
          <span id={errorId} class="error-message" role="alert" aria-live="assertive">
            {this.error}
          </span>
        )}
      </div>
    );
  }
}
