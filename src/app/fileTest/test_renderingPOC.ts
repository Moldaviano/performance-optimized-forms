import { FieldType, Section } from '../shared/sharedTypes/sectionType';

//esempio di dati che potrebbero arrivare dal server in formato JSON
export const fakeFormData: {
  sections: Section[];
} = {
  sections: [
    {
      name: {
        en: 'Section 1',
        it: 'Sezione',
      },
      order: 1,
      fields: [
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
          value: 'Paolo',
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
          value: 'Rossi',
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
          value: '15',
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
          value: ['Windows', 'Linux', 'MACOS'],
        },
      ],
    },
    {
      name: {
        en: 'Section 1',
        it: 'Sezione',
      },
      order: 1,
      fields: [
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
          value: 'Paolo',
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
          value: 'Rossi',
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
          value: '15',
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
          value: ['Windows', 'Linux', 'MACOS'],
        },
      ],
    },
  ],
};

// //sorting delle varie sezioni
// fakeFormData.sections.sort(function (a, b) { return a.order - b.order; });
// for (let section of fakeFormData.sections) {
//     section.fields.sort(function (a, b) { return a.order - b.order; });
// }

// // riassegnazione dell'order di sections e fields in modo che siano numeri consecutivi,
// // serve per evitare un problema di rendering della pagina nel caso in cui arrivino dal server
// // sections e/o fields non in ordine
// for (let i = 0; i < fakeFormData.sections.length; i++) {
//     fakeFormData.sections[i].order = i;
//     for (let j = 0; j < fakeFormData.sections[i].fields.length; j++) {
//         fakeFormData.sections[i].fields[j].order = j;
//     }
// }

//_______________

// ordinaSection = () {

//     fakeFormData.sections.sort(function (a, b) { return a.order - b.order; });
//     for (let section of fakeFormData.sections) {
//         section.fields.sort(function (a, b) { return a.order - b.order; });
//     }
// }

// {
//     "fieldName":,
//     "label": {
//         "it": ,
//         "en":
//     },
//     "fieldType": ,
//     "selectableItems": [
//         "Levi",
//         "8 Marzo",
//         "Majorana"
//     ],
//     "mandatory": false,
//     "order": 0,
//     "value":
// }

// export function validPhoneNumber(number: number){
//     return (control: AbstractControl): ValidationErrors | null => {
//         const
//     }
// }
