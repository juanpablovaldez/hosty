import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/salones')({
  component: () => <Outlet />,
})
