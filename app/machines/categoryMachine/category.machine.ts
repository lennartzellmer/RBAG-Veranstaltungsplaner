import { setup, type ActorRefFrom } from 'xstate'
import { categoryUpdateMachine } from './categoryUpdate.machine'
import { categoryCreateMachine } from './categoryCreate.machine'
import { showToast } from '../actions/toast'
import { createFetchPaginatedMachine } from '../fetchPaginated/fetchPaginated.machine'
import { getVeranstaltungsKategorienPaginated } from '~/service/veranstaltung-kategorie'

type SpawnedCategoryCreateMachine = ActorRefFrom<typeof categoryCreateMachine>
type SpawnedCategoryUpdateMachine = ActorRefFrom<typeof categoryUpdateMachine>

export const categoryMachine = setup({
  types: {
    events: {} as
    | { type: 'EDIT', categoryId: string }
    | { type: 'CREATE' },
    context: {} as {
      categoryCreateActorRef?: SpawnedCategoryCreateMachine
      categoryUpdateActorRef?: SpawnedCategoryUpdateMachine
    },
    children: {} as {
      categoryCreateMachine: 'categoryCreateMachine'
      categoryUpdateMachine: 'categoryUpdateMachine'
      fetchPaginatedMachine: 'fetchPaginatedMachine'
    }
  },
  actions: {
    showToast
  },
  actors: {
    categoryUpdateMachine,
    categoryCreateMachine,
    fetchPaginatedMachine: createFetchPaginatedMachine({
      fetchDataFunction: getVeranstaltungsKategorienPaginated
    })
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAXMUD2AnAngLKrIAWAlgHZgB0sp2A7gMIZZ7lwDEAogCIBJACoBtAAwBdRKAAO2WOXTlslaSAAeiACwA2AEw0AnIZ1iAHMZ0BGQwFYA7FoA0IfIj077NHbZ2GxhlamZlpWZgC+4S5omDgExGRUtPRMrLEc3MwASjwAgkI84lJIIHIKSipqmgi6BpbmljYOzq6IVloAzDQdWmJaZnq2ZlYdYvY6kdFscUQkFNQ0kIpp7ARcECq0VABu2ADWtDGr+ACqMhBsCfNgRWplisqqJdW1RiYNJk2OLm4IenpiGhmDoeQzDexmTy2WxaSYgI4zK5JGjIXBgNgrGbrTY0Hb7Q7TPD4Zhoy5zJK3Er3CpPUAvHQ6IxmexiDpmPpaQz2QI6H6IEw0WxBUZ9EEdQxaWwdSJRECUbAQOBqBFEpHUO7yB6VZ6IAC0vNaCH1NDEprN5vN9jhKvi5IWKRYhNwnHgVM1NKq2j0fIQhi6Yh8Vis5n6+g6tkM1qds0SCyW6ExRI15UenoQ9j0XTBDgC9iDFjE3sNANs3nFIJZPT04yj6VtscOpMwiYIya1tI0iAzWbMOa5+f8Rd+w26-0MmccHRGkJl4SAA */
  context: {},
  id: 'categoryMachine',
  initial: 'showCategories',
  states: {
    showCategories: {
      invoke: {
        src: 'fetchPaginatedMachine',
        id: 'fetchPaginatedMachine'
      },
      on: {
        EDIT: {
          target: 'editCategory'
        },
        CREATE: {
          target: 'createCategory'
        }
      }
    },
    editCategory: {
      invoke: {
        src: 'categoryUpdateMachine',
        id: 'categoryUpdateMachine',
        onDone: {
          target: 'showCategories'
        }
      }
    },
    createCategory: {
      invoke: {
        src: 'categoryCreateMachine',
        id: 'categoryCreateMachine',
        onDone: {
          target: 'showCategories'
        }
      }
    }
  }
})
