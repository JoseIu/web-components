import { Component, Element, h, Listen, State } from '@stencil/core';

@Component({
  tag: 'ntt-date-picker',
  styleUrl: './ntt-date.css',
  shadow: true,
})
export class NttDatePicker {
  @Element() el: HTMLElement;
  @State() selectedDate: string | null = null;
  @State() isEditing = false;

  private textInput: HTMLInputElement;
  private dateInput: HTMLInputElement;
  @Listen('keydown', { target: 'document' })
  handleKeyDown(ev: KeyboardEvent) {
    // if (ev.key === 'Enter' && this.isEditing) {
    //   console.log('SE DIO A BUSCAR');
    // }

    if (this.el.contains(document.activeElement)) {
      if (ev.key === 'Enter' && this.isEditing) {
        console.log('SE DIO A BUSCAR');
        this.toggleEdit();
      }

      if (document.activeElement === this.textInput && !this.isEditing && ev.key.length === 1) {
        console.log('ESTAMOS EN EL INPUT DE TEXTO');
        ev.preventDefault();
        this.isEditing = true;
        this.textInput.readOnly = false;
        // Agregar la tecla presionada al valor del input
        this.textInput.value = ev.key;
      }
    }
  }

  componentDidLoad() {
    if (!this.selectedDate) {
      console.log('componentDidLoad: No date selected');
    }
    this.undateTextInput();
    console.log('conectado');
  }

  onSelectDate(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
    this.selectedDate = input.value;
    this.undateTextInput();
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.textInput.readOnly = !this.isEditing;
    if (this.isEditing) {
      console.log('editing');
      // this.textInput.focus();
    }
  }
  undateTextInput() {
    if (!this.selectedDate || !this.textInput) {
      console.log('NO NAY DATA');
      this.textInput.value = '';
      return;
    }

    const date = new Date(this.selectedDate);
    const formattedDate = date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    this.textInput.value = formattedDate;
  }
  render() {
    return (
      <div class="date">
        <span>Fecha de ida:</span>
        <input type="text" name="text" id="text" placeholder="text" />
        <input
          ref={el => (this.textInput = el)}
          class="date__input"
          type="text"
          name=""
          id="fecha-ida"
          readOnly={!this.isEditing}
          placeholder="fecha de ida"
          // onKeyDown={e => e.key === '' && this.toggleEdit()}
          onFocus={() => this.toggleEdit()}
          tabIndex={0}
        />

        <input ref={el => (this.dateInput = el)} class="date__date" type="date" name="" id="fecha-ida-date" onInput={event => this.onSelectDate(event)} tabIndex={0} />
      </div>
    );
  }
}
