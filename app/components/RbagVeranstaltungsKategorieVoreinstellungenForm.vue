<script setup lang="ts">
import { getUsers } from '~/service/user'
import { uploadFileToTempStorage } from '~/service/veranstaltung-kategorie'
import type { VeranstaltungsKategorieSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

const voreinstellungen = defineModel<VeranstaltungsKategorieSchema['voreinstellungen']>({
  required: true
})

const { data, pending } = await useAsyncData('admin-users', () => getUsers())

const users = computed({
  get: () => {
    return data.value?.data.map(user => ({
      label: `${user.givenName} ${user.familyName}`,
      value: user.id,
      ...user
    }))
  },
  set: (event) => {
    voreinstellungen.value.leitung.userIds = event ? event.map(item => item.value) : []
  }
})

const handleFileUpload = async (file: File | null | undefined) => {
  if (!file) {
    voreinstellungen.value.anzeigebild.objectName = ''
    return
  }
  const tempFile = await uploadFileToTempStorage(file)
  voreinstellungen.value.anzeigebild.objectName = tempFile.key
}
</script>

<template>
  <div class="space-y-5">
    <div class="space-y-1">
      <p class="text-base font-semibold text-neutral-800">
        Voreinstellungen
      </p>
      <p class="text-sm text-neutral-500">
        Standardangaben, die bei neuen Veranstaltungen vorbelegt werden.
      </p>
    </div>

    <UFormField
      label="Zielgruppe"
      name="voreinstellungen.zielgruppe"
    >
      <UInput
        v-model="voreinstellungen.zielgruppe"
        :ui="{ root: 'w-full' }"
      />
    </UFormField>

    <UFormField
      label="Beschreibung (Voreinstellung)"
      name="voreinstellungen.beschreibung"
    >
      <UTextarea
        v-model="voreinstellungen.beschreibung"
        :ui="{ root: 'w-full' }"
      />
    </UFormField>

    <div class="grid gap-4">
      <UFormField
        label="Anzeigebild"
        name="voreinstellungen.anzeigebild.objectName"
      >
        <UFileUpload
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          accept="image/*"
          class="w-full"
          :ui="{
            base: 'min-h-48'
          }"
          @update:model-value="handleFileUpload"
        />
      </UFormField>
    </div>

    <USeparator />

    <RbagUserSelector
      v-if="users"
      :form-field-options="{
        label: 'Leitung',
        name: 'voreinstellungen.leitung.userIds'
      }"
      :users="users"
      :loading="pending"
      @update:model-value="(value) => { voreinstellungen.leitung.userIds = value.map(item => item.id) }"
    />

    <USeparator />

    <div class="space-y-3">
      <p class="text-md font-medium text-neutral-700">
        Adresse
      </p>
      <div class="grid grid-cols-1 gap-4">
        <UFormField
          label="Veranstaltungsort"
          name="voreinstellungen.ort.name"
        >
          <UInput
            v-model="voreinstellungen.ort.name"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
        <UFormField
          label="Adresszeile 1"
          name="voreinstellungen.ort.adresszeile1"
        >
          <UInput
            v-model="voreinstellungen.ort.adresszeile1"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
        <UFormField
          label="Adresszeile 2"
          name="voreinstellungen.ort.adresszeile2"
        >
          <UInput
            v-model="voreinstellungen.ort.adresszeile2"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
        <div class="flex gap-4">
          <UFormField
            label="PLZ"
            name="voreinstellungen.ort.plz"
            class="w-32"
          >
            <UInput
              v-model="voreinstellungen.ort.plz"
              :ui="{ root: 'w-full' }"
              :maxlength="5"
            />
          </UFormField>
          <UFormField
            label="Ort"
            name="voreinstellungen.ort.ort"
            class="w-full"
          >
            <UInput
              v-model="voreinstellungen.ort.ort"
              :ui="{ root: 'w-full' }"
            />
          </UFormField>
        </div>
        <UFormField
          label="Land"
          name="voreinstellungen.ort.land"
        >
          <UInput
            v-model="voreinstellungen.ort.land"
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
      </div>
    </div>
  </div>
</template>
