<script setup lang="ts">
import type { ActorRefFromLogic } from 'xstate'
import type { categoryUpdateMachine } from '~/machines/categoryMachine/categoryUpdate.machine'
import type { VeranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

const form = useTemplateRef('form')

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  categoryUpdateActorRef?: ActorRefFromLogic<typeof categoryUpdateMachine>
  categoryId: string
  open: boolean
}>()

const onClose = (event: boolean) => {
  if (event === false) {
    emit('close')
  }
}

const handleSubmit = (state: VeranstaltungsKategorieCreateSchema) => {
  props.categoryUpdateActorRef?.send({ type: 'SAVE', category: { id: props.categoryId, ...state } })
}
</script>

<template>
  <USlideover
    title="Kategorie Bearbeiten"
    :open="open"
    :dismissible="false"
    @update:open="onClose"
  >
    <template #body>
      <RbagVeranstaltungsKategorieForm
        ref="form"
        @submit="handleSubmit"
      />
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="Kategorie bearbeiten"
          @click="form?.submit()"
        />
      </div>
    </template>
  </USlideover>
</template>
