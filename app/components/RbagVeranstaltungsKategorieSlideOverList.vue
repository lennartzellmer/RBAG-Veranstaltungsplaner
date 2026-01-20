<script setup lang="ts">
import { useActor, useSelector } from '@xstate/vue'
import { categoryMachine } from '~/machines/categoryMachine/category.machine'

const { snapshot: snap, send, actorRef } = useActor(categoryMachine)

const createMachineRef = useSelector(actorRef, state => state.children.categoryCreateMachine)

const editMachineRef = useSelector(actorRef, state => state.children.categoryUpdateMachine)

const fetchMachineRef = useSelector(
  actorRef,
  state => state.children.fetchPaginatedMachine
)

const state = useSelector(fetchMachineRef, state => state)
</script>

<template>
  <USlideover
    title="Veranstaltungskategorien"
    description="Kategorien können Standardtexte und Einstellungen für Veranstaltungen setzen."
  >
    <template #body>
      <div
        class="gap-3 grid grid-cols-1"
      >
        <RbagKategorieCard
          v-for="kategorie in state?.context.data"
          :key="kategorie.id"
          :title="kategorie.name"
          :description="kategorie.beschreibung"
          @edit="send({ type: 'EDIT', categoryId: kategorie.id })"
        >
          <RbagVeranstaltungsKategorieSlideOverEdit
            :category-update-actor-ref="editMachineRef"
            :category-id="kategorie.id"
            :open="snap.matches('editCategory')"
            @close="editMachineRef?.send({ type: 'CLOSE' })"
          />
        </RbagKategorieCard>
      </div>
      <RbagVeranstaltungsKategorieSlideOverCreate
        :category-create-actor-ref="createMachineRef"
        :open="snap.matches('createCategory')"
        @close="createMachineRef?.send({ type: 'CLOSE' })"
      />
    </template>

    <template #footer>
      <div class="flex gap-2 justify-between w-full">
        <RbagPagination
          v-if="state?.context.paginationMachineRef"
          :pagination-actor-ref="state?.context.paginationMachineRef"
        />
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="Hinzufügen"
          @click="send({ type: 'CREATE' })"
        />
      </div>
    </template>
  </USlideover>
</template>
