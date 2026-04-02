import { Injectable } from '@angular/core';
import { Field, Section } from '../shared/sharedTypes/sectionType';

@Injectable({
  providedIn: 'root',
})
export class DataFlowService {
  // public observable = new Observable((subscriber) => {
  //   subscriber.next(1);
  //   subscriber.next(2);
  //   subscriber.next(3);
  //   setTimeout(() => {
  //     subscriber.next(4);
  //     subscriber.complete();
  //   }, 2000);
  // });

  private readonly nMaxSections: number = 50;
  private readonly nMaxFields: number = 20;

  /**
   *
   * @returns {Section[]} Array di sezioni generate in maniera casuale
   */
  public getFakeData(): Section[] {
    let fakeData: Section[] = [];
    fakeData = this.getSections(fakeData);
    // this.observable.subscribe({
    //   next(x) { console.log("got value " + x); },
    //   error(err) { console.error(err); },
    //   complete() { console.log("lessgoo"); }
    // });
    return fakeData;
  }

  /**
   *
   * @param {Section[]} fakeData
   * @returns {Section[]}
   */
  private getSections(fakeData: Section[]): Section[] {
    // let nSections = this.getNSections()
    for (let i = 0; i < this.nMaxSections; i++) {
      fakeData[i] = {
        name: {
          en: `Section ${i}`,
          it: `Sezione ${i}`,
        },
        order: i,
        fields: this.getFields(),
      };
      //INIZIO assegnazioni utilizzate per test vari
      fakeData[i].fields[5].depends = {
        isDependent: true,
        dependsFrom: [
          fakeData[i].fields[3].fieldName,
          fakeData[i].fields[4].fieldName,
        ],
      };
      fakeData[i].fields[2].depends = {
        isDependent: false,
        fieldStatus: {
          conditionForVisibility: {
            firstComparedFactor: 4,
            comparator: '<',
            secondComparedFactor: 5,
          },
        },
      };
      //FINE assegnazioni utilizzate per test vari
      // console.log(fakeData[i].fields);
    }
    return fakeData;
  }

  /**
   * restituisce un array di field con order e fieldName diversi
   * @returns {Field}
   */
  private getFields(): Field[] {
    let fields = [];
    for (let i = 0; i < this.nMaxFields; i++) {
      let field = { ...this.getFakeField() };
      field.order = i;
      field.fieldName += i;
      field.mandatory = Math.round(Math.random()) === 0;
      if (field.fieldType === 'PASSWORD') {
        /**
         * se field.textval non esiste lo creo
         */
        if (!field.textVal) {
          field.textVal = {};
        }
        field.textVal.isPass = true;
      }
      fields.push(field);
    }
    return fields;
  }

  /**
   * restituisce un field scelto casualmente tra quelli nell'array fakeFields
   * @returns {Field}
   */
  private getFakeField(): Field {
    return this.fakeFields[Math.floor(Math.random() * this.fakeFields.length)];
  }

  /**
   * restituisce un numero casuale di sections che saranno inserite nella pagina
   * @returns {number}
   */
  private getNSections(): number {
    return Math.round(Math.random() * this.nMaxSections);
  }

  /**
   * restituisce un numero casuale di fields da inserire in una section
   * @returns {number}
   */
  private getNFields(): number {
    return Math.round(Math.random() * this.nMaxFields);
  }

  /**
   * array di modelli di campi da inserire nelle sezioni
   */
  private readonly fakeFields: Field[] = [
    {
      fieldName: 'name',
      label: {
        it: 'Nome',
        en: 'Name',
      },
      fieldType: 'TEXT',
      textVal: {
        isName: true,
      },
      mandatory: false,
      order: 0,
      value: '',
    },
    {
      fieldName: 'cognome',
      label: {
        it: 'Cognome',
        en: 'Surname',
      },
      fieldType: 'TEXT',
      mandatory: false,
      order: 2,
      value: '',
    },
    {
      fieldName: 'number',
      label: {
        it: 'Numero',
        en: 'Number',
      },
      fieldType: 'NUMERIC',
      numVal: {
        minVal: 0,
        maxVal: 16,
      },
      mandatory: false,
      order: 6,
      value: '',
    },
    {
      fieldName: 'data-di-nascita',
      label: {
        it: 'Data di nascita',
        en: 'Birth Date',
      },
      fieldType: 'DATE',
      mandatory: false,
      order: 3,
      value: '',
    },
    {
      fieldName: 'email',
      label: {
        it: 'Email',
        en: 'Email',
      },
      fieldType: 'TEXT',
      textVal: {
        isName: false,
        isEmail: true,
      },
      mandatory: false,
      order: 4,
      value: '',
    },
    {
      fieldName: 'residenza',
      label: {
        it: 'Residenza',
        en: 'Residence',
      },
      fieldType: 'SELECT',
      selectableItems: ['Mirano', 'Spinea', 'Mestre'],
      mandatory: false,
      order: 5,
      value: '',
    },
    {
      fieldName: 'sistema_operativo',
      label: {
        it: 'SO',
        en: 'OS',
      },
      fieldType: 'RADIO',
      selectableItems: ['Windows', 'Linux', 'MACOS'],
      mandatory: false,
      order: 8,
      value: '',
    },
    {
      fieldName: 'checkbox_ex',
      label: {
        it: 'Prova CheckBox',
        en: 'Checkbox example',
      },
      fieldType: 'CHECKBOX',
      selectableItems: ['Windows', 'Linux', 'MACOS'],
      mandatory: false,
      order: 8,
      value: '',
    },
    {
      fieldName: 'password',
      label: {
        it: 'Password',
        en: 'Password',
      },
      fieldType: 'PASSWORD',
      textVal: {
        isName: false,
      },
      mandatory: false,
      order: 0,
      value: '',
    },
    {
      fieldName: 'comment',
      label: {
        it: 'Commento',
        en: 'Comment',
      },
      fieldType: 'TEXT_AREA',
      textVal: {
        isName: false,
      },
      mandatory: false,
      order: 0,
      value: '',
    },
    {
      fieldName: 'todo',
      label: {
        it: 'Da fare',
        en: 'TODO list',
      },
      fieldType: 'MULTI_SELECT',
      selectableItems: ['task1', 'task2', 'task3', 'task4'],
      mandatory: false,
      order: 5,
      value: '',
    },
  ];
}
