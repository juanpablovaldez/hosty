import { createFileRoute } from '@tanstack/react-router';
import { SalonesPage } from '../features/salones/components/SalonesPage';

export const Route = createFileRoute('/salones')({
  component: SalonesPage,
});
