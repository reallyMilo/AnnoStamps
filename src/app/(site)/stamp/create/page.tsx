import type { Metadata } from 'next';

import { CreateStamp } from '@/view/CreateStamp';

import { CreateStampForm } from './CreateStampForm';

export const metadata: Metadata = {
  title: 'Create 117 Stamp | AnnoStamps',
};

const CreateStampPage = () => {
  return (
    <CreateStamp>
      <CreateStampForm />
    </CreateStamp>
  );
};

export default CreateStampPage;
