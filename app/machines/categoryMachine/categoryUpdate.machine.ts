import { assertEvent, fromPromise, setup } from 'xstate'
import type { VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'
import { updateVeranstaltungsKategorie } from '~/service/veranstaltung-kategorie'
import { showToast } from '../actions/toast'

export type MachineEvents
  = | { type: 'SAVE', category: VeranstaltungsKategorieSchema }
    | { type: 'CLOSE' }

export const categoryUpdateMachine = setup({
  types: {
    events: {} as MachineEvents
  },
  actors: {
    updateCategoryActor: fromPromise(async ({ input }: { input: { category: VeranstaltungsKategorieSchema } }) => {
      return await updateVeranstaltungsKategorie({ id: input.category.id, category: input.category })
    })
  },
  actions: {
    showToast
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAXMUD2AnAngKoAOEGYAsqsgBYCWAdmAHR0QA2YAxAMIAyAeQDKAUQDaABgC6iUMWyw66OtgayQAD0QBGACwTmANgCsADlO6AnNsOnjJgOwAaEPkQAmQ9uYTL70w66QYYS-roAvuEuaJg4BCRkmFS0jCxsnFxCAIIAauLS6vKKyqrqWgjalrrM5hK67pZ1AMyG7sYtLm4V2t66le4OhkEtllXukdHkcUSk5Mn0TMwArrPKDFA8U3j4XBCqaQwAbtgA1iwxWNsJc9QLLCuJjBtbBAiMxzEqDJJSP4UKSi+ZUQQ2qAR67khtRa2k6iEsDmY7l8unaTWMEmM+l0DgmIAu02uSVuqWWqyem1i2y4YFwuDwzGI7AwADM8ABbZgEq6rSgkxYPDAUl74N5HbCfVQ-P5IEBFQGlWXlbRNSzMQZWPwSCReOr+OEIAC0TXczCaNgkgX89gcbQieIY2AgcHU3PivPmqX+xSBSsQhsMBsNPTVhlVEiagUs7SsxjxbpmiT5KUW6TA3oVaj9CHqBp63gkATaWNMOsMllM4yi+JFROTd2YeyYGZKWdA5XMhiRpnDuocliag7zbR82gsDl7XiGcerCbrnoF5PWlMuBBbvvbiCapfVI0sYcGg-LxgN0eYY8MJkqqt0TXq9siQA */
  id: 'categoryUpdateMachine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLOSE: {
          target: 'done'
        },
        SAVE: {
          target: 'updatingCategory',
          reenter: true
        }
      }
    },
    done: {
      type: 'final'
    },
    updatingCategory: {
      invoke: {
        src: 'updateCategoryActor',
        input: ({ event }) => {
          assertEvent(event, 'SAVE')
          return { category: event.category }
        },
        onDone: {
          target: 'done',
          actions: {
            type: 'showToast',
            params: () => ({
              title: 'Kategorie aktualisiert',
              description: 'Die Veranstaltungskategorie wurde erfolgreich aktualisiert.',
              color: 'success',
              icon: 'i-lucide-check-circle'
            })
          }
        },
        onError: {
          target: 'idle',
          actions: {
            type: 'showToast',
            params: () => ({
              title: 'Fehler beim Aktualisieren',
              description: 'Die Veranstaltungskategorie konnte nicht aktualisiert werden. Bitte versuche es erneut.',
              color: 'error',
              icon: 'i-lucide-alert-circle'
            })
          },
          reenter: true
        }
      }
    }
  }
})
