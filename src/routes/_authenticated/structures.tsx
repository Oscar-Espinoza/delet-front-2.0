import { createFileRoute } from '@tanstack/react-router'
import StructuresPage from '@/features/structures'

export const Route = createFileRoute('/_authenticated/structures')({
  component: StructuresPage,
})
