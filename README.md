# RenderingPOC

**Proof of Concept** Angular per analizzare e testare l'utilizzo degli **accordion** come strategia di **lazy rendering** al fine di migliorare le performance di caricamento di pagine web che contengono un numero elevato di form e campi compilabili.

## Indice

- [Obiettivo](#obiettivo)
- [Stack Tecnologico](#stack-tecnologico)
- [Struttura del Progetto](#struttura-del-progetto)
- [Architettura](#architettura)
  - [Modello dei Dati](#modello-dei-dati)
  - [Flusso dei Dati](#flusso-dei-dati)
  - [Generazione dei Form](#generazione-dei-form)
  - [Tipi di Campo](#tipi-di-campo)
  - [Sistema di Dipendenze](#sistema-di-dipendenze)
  - [Validazione](#validazione)
- [Avvio del Progetto](#avvio-del-progetto)
  - [Prerequisiti](#prerequisiti)
  - [Installazione](#installazione)
  - [Server di Sviluppo](#server-di-sviluppo)
  - [Build](#build)
  - [Esecuzione dei Test](#esecuzione-dei-test)
- [Configurazione](#configurazione)
- [Limitazioni Note e TODO](#limitazioni-note-e-todo)

---

## Obiettivo

Il progetto nasce dall'esigenza di gestire pagine web che presentano un **numero elevato di sezioni form** (potenzialmente decine), ciascuna con molti campi compilabili. Il rendering simultaneo di tutti i componenti al caricamento della pagina provoca un degrado significativo delle performance.

L'approccio studiato in questo POC è l'utilizzo degli **accordion**: ogni sezione form è racchiusa in un pannello collassabile e il contenuto (i campi) viene renderizzato **solo al momento dell'apertura** del pannello, evitando di istanziare nell'albero del DOM centinaia di `FormControl` e componenti che l'utente potrebbe non utilizzare mai.

**Domanda di ricerca:** l'utilizzo degli accordion per il lazy rendering è una soluzione percorribile e misurabile per migliorare le performance su un numero importante di form in una singola pagina?

Il `DataFlowService` simula un caso estremo generando fino a **50 sezioni × 20 campi** (1000 campi totali) per permettere test significativi.

---

## Stack Tecnologico

| Tecnologia | Versione | Ruolo |
|---|---|---|
| [Angular](https://angular.io/) | 14 | Framework SPA |
| [Angular Reactive Forms](https://angular.io/guide/reactive-forms) | 14 | Gestione form dinamici |
| [RxJS](https://rxjs.dev/) | ~7.5 | Wiring reattivo delle dipendenze tra campi |
| [@ng-select/ng-select](https://github.com/ng-select/ng-select) | ^9 | Dropdown select e multi-select |
| [TypeScript](https://www.typescriptlang.org/) | ~4.7 | Tipizzazione forte dello schema dati |
| [Karma](https://karma-runner.github.io/) + Jasmine | ~6.3 / ~4.1 | Test unitari |

---

## Struttura del Progetto

```
src/
└── app/
    ├── app.component.*             # Shell radice — renderizza <app-home>
    ├── app-routing.module.ts       # Modulo di routing (nessuna route definita al momento)
    ├── app.module.ts               # NgModule radice
    │
    ├── pages/
    │   └── home/                   # Pagina principale — renderizza <app-auto-generated-form>
    │
    ├── services/
    │   └── data-flow.service.ts    # Genera dati mock Section[] (simula risposta dal server)
    │
    ├── shared/
    │   ├── sharedTypes/
    │   │   └── sectionType.ts      # Tutti i tipi di dominio: Section, Field, FieldType, condizioni, ecc.
    │   │
    │   ├── auto-generated-form/
    │   │   ├── auto-generated-form.component.*          # Carica le sezioni e le itera
    │   │   └── auto-generated-form-section/
    │   │       └── auto-generated-form-section.component.*  # Nucleo: costruisce il FormArray e gestisce la logica
    │   │
    │   └── directives/
    │       └── validators/         # Direttive Angular per la validazione custom
    │           ├── date-max-validator.directive.ts
    │           ├── date-min-validator.directive.ts
    │           ├── string-check-validator.directive.ts
    │           ├── string-max-length-validator.directive.ts
    │           └── string-min-length-validator.directive.ts
    │
    └── fileTest/
        └── test_renderingPOC.ts    # Dati statici di fixture (replica una risposta JSON reale dal server)
```

---

## Architettura

### Modello dei Dati

Tutti i tipi sono definiti in `src/app/shared/sharedTypes/sectionType.ts`.

Un form è descritto come un array di oggetti **`Section`**:

```ts
type Section = {
  name: LangCode;   // { it: string; en: string }
  order: number;
  fields: Field[];
};
```

Ogni **`Field`** all'interno di una sezione contiene tipo, label, configurazione di validazione e info opzionali sulle dipendenze:

```ts
type Field = {
  fieldName: string;
  label: LangCode;
  fieldType: FieldType;
  numVal?: numericProp;        // min/max per NUMERIC
  textVal?: stringProp;        // isName, isEmail, isPass, min/maxLength
  dateVal?: dateProp;          // data min/max
  selectableItems?: string[];  // opzioni per SELECT, MULTI_SELECT, RADIO, CHECKBOX
  mandatory: boolean;
  order: number;
  depends?: dependent;         // dipendenza di visibilità / abilitazione
  value: string | string[];
};
```

---

### Flusso dei Dati

```
DataFlowService.getFakeData()
        │
        ▼
AutoGeneratedFormComponent          ← riceve Section[]
        │
        ├── *ngFor sulle sezioni
        ▼
AutoGeneratedFormSectionComponent   ← riceve una singola Section
        │
        ├── costruisce FormArray
        ├── applica i validatori
        └── collega le dipendenze tra campi via RxJS merge()
```

`DataFlowService` funge da **backend simulato**: costruisce una `Section[]` con combinazioni casuali di campi scelte da 11 template predefiniti. Per integrare un backend reale è sufficiente sostituire `getFakeData()` con una chiamata HTTP che restituisca la stessa struttura `Section[]`.

Il file `src/app/fileTest/test_renderingPOC.ts` fornisce dati statici e deterministici utili per i test unitari o per l'ispezione manuale, replicando esattamente il formato di risposta JSON atteso dal server.

---

### Generazione dei Form

`AutoGeneratedFormSectionComponent` è il motore principale. Per ogni sezione:

1. **Ordina** i campi tramite la proprietà `order` e li reindicizza.
2. **Crea** un `FormControl` per ciascun campo (all'interno di un `FormArray`).
3. **Mappa** il `fieldType` al corretto attributo HTML `type`.
4. **Associa** validatori sincroni basati su `textVal`, `numVal`, `dateVal` e `mandatory`.
5. **Collega** la logica di abilitazione/disabilitazione dei campi dipendenti tramite `RxJS merge()` sugli eventi `valueChanges` dei controlli padre.

---

### Tipi di Campo

| `fieldType` | Reso come | Note |
|---|---|---|
| `TEXT` | `<input type="text">` | Supporta i sotto-tipi `isName`, `isEmail` |
| `TEXT_AREA` | `<textarea>` | |
| `NUMERIC` | `<input type="number">` | Supporta `minVal` / `maxVal` |
| `DATE` | `<input type="date">` | Supporta data minima e massima |
| `PASSWORD` | `<input type="password">` | Toggle di visibilità supportato |
| `SELECT` | `<ng-select>` (singolo) | Opzioni da `selectableItems` |
| `MULTI_SELECT` | `<ng-select multiple>` | Opzioni da `selectableItems` |
| `RADIO` | gruppo `<input type="radio">` | Opzioni da `selectableItems` |
| `CHECKBOX` | gruppo `<input type="checkbox">` | Opzioni da `selectableItems` |

---

### Sistema di Dipendenze

Un campo può dichiarare una proprietà `depends` per esprimere uno di due comportamenti:

**1. Dipendente da altri campi (`isDependent: true`)**

Il campo rimane **disabilitato** finché tutti i campi elencati in `dependsFrom[]` non hanno un valore non vuoto.

```ts
depends: {
  isDependent: true,
  dependsFrom: ['fieldName_A', 'fieldName_B'],
}
```

**2. Visibilità condizionale (`isDependent: false`)**

La visibilità del campo è controllata da una `conditionForVisibility` che confronta due fattori tramite un operatore di confronto (`comparator`):

```ts
depends: {
  isDependent: false,
  fieldStatus: {
    conditionForVisibility: {
      firstComparedFactor: 4,
      comparator: '<',   // ==, ===, !=, <, >, <=, >=, isIncludedIn
      secondComparedFactor: 5,
    },
  },
}
```

Comparatori supportati: `==` `===` `!=` `<` `>` `<=` `>=` `isIncludedIn`

---

### Validazione

La validazione è applicata a livello di `FormControl` all'interno di `AutoGeneratedFormSectionComponent` e tramite **direttive Angular custom**:

| Direttiva | Cosa valida |
|---|---|
| `StringCheckValidatorDirective` | Formato testo (nome, email, ecc.) |
| `StringMinLengthValidatorDirective` | Lunghezza minima della stringa |
| `StringMaxLengthValidatorDirective` | Lunghezza massima della stringa |
| `DateMinValidatorDirective` | Data minima consentita |
| `DateMaxValidatorDirective` | Data massima consentita |

I campi con `mandatory: true` vengono validati tramite `Validators.required` in modo reattivo.

---

## Avvio del Progetto

### Prerequisiti

- [Node.js](https://nodejs.org/) ≥ 16
- [Angular CLI](https://angular.io/cli) ~14

```bash
npm install -g @angular/cli@14
```

### Installazione

```bash
git clone <repository-url>
cd renderingPOC-master
npm install
```

### Server di Sviluppo

```bash
npm start
# oppure
ng serve
```

Navigare su `http://localhost:4200/`. L'applicazione si ricarica automaticamente ad ogni modifica ai file sorgente.

### Build

```bash
ng build
```

Build di produzione:

```bash
ng build --configuration production
```

Gli artefatti della build vengono salvati nella cartella `dist/`.

### Esecuzione dei Test

```bash
ng test
```

I test vengono eseguiti tramite [Karma](https://karma-runner.github.io) con il framework Jasmine.

---

## Configurazione

| File | Scopo |
|---|---|
| `angular.json` | Configurazione workspace Angular CLI |
| `tsconfig.json` | Configurazione TypeScript base |
| `tsconfig.app.json` | Configurazione TS specifica per l'app |
| `tsconfig.spec.json` | Configurazione TS specifica per i test |
| `src/environments/environment.ts` | Variabili d'ambiente per lo sviluppo |
| `src/environments/environment.prod.ts` | Variabili d'ambiente per la produzione |

Per collegare il loader dei dati a una API reale, modificare `DataFlowService` iniettando `HttpClient` e sostituendo `getFakeData()` con una chiamata HTTP che restituisca `Section[]`.

---

## Limitazioni Note e TODO

- **Nessuna route definita:** `AppRoutingModule` è dichiarato ma l'array `Routes` è vuoto. Le future pagine richiederanno l'aggiunta delle route.
- **Solo dati mock:** `DataFlowService` genera dati casuali in locale. L'integrazione con un backend reale richiede la sostituzione di `getFakeData()` con una chiamata HTTP.
- **Import inutilizzato in `sectionType.ts`:** `R3PipeDependencyMetadata` da `@angular/compiler` è importato ma mai utilizzato — sicuro da rimuovere.
- **`AutoGeneratedFormComponent`:** Il decoratore `@Input()` è importato ma non applicato ad alcuna proprietà — da rimuovere.
- **Nessun test end-to-end:** `ng e2e` richiede l'aggiunta manuale di un package dedicato (es. Cypress o Playwright).
