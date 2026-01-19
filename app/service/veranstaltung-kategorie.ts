import type { PaginatedRequestParams } from '~/types/base.types'
import type { VeranstaltungsKategorieUpdateSchema, VeranstaltungsKategorieCreateSchema } from '~~/shared/validation/veranstaltungKategorieSchema'

export async function getVeranstaltungsKategorienPaginated({ paginationParams }: { paginationParams: PaginatedRequestParams }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie`, {
    method: 'GET',
    params: {
      offset: paginationParams.offset,
      limit: paginationParams.limit
    }
  })
}

export async function updateVeranstaltungsKategorie({ id, category }: { id: string, category: VeranstaltungsKategorieUpdateSchema }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie/${id}/update`, {
    method: 'POST',
    body: category
  })
}

export async function createVeranstaltungsKategorie({ category }: { category: VeranstaltungsKategorieCreateSchema }) {
  return await $fetch(`/api/admin/veranstaltung-kategorie/create`, {
    method: 'POST',
    body: category
  })
}

export async function uploadFileToTempStorage(file: File) {
  const uploadData = await $fetch('/api/admin/media/init-upload', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
      size: file.size
    }
  })

  await $fetch(uploadData.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': uploadData.contentType }
  })

  return { key: uploadData.key }
}
