import { CreateStructureModal } from './create-structure-modal'
import { EditStructureModal } from './edit-structure-modal'
import { ViewStructureDialog } from './view-structure-dialog'

export function StructuresDialogs() {
  return (
    <>
      <CreateStructureModal />
      <EditStructureModal />
      <ViewStructureDialog />
    </>
  )
}