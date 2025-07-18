import { CreateBillingEntityModal } from './create-billing-entity-modal'
import { DeleteBillingEntityDialog } from './delete-billing-entity-dialog'
import { EditBillingEntityModal } from './edit-billing-entity-modal'
import { ViewBillingEntityDialog } from './view-billing-entity-dialog'

export function BillingEntitiesDialogs() {
  return (
    <>
      <CreateBillingEntityModal />
      <EditBillingEntityModal />
      <ViewBillingEntityDialog />
      <DeleteBillingEntityDialog />
    </>
  )
}
