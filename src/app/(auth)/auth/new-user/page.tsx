import { redirect } from 'next/navigation';

import { getSession } from '@/auth';

const NewUserPage = async () => {
	const session = await getSession();
	if (!session) {
		redirect(`/auth/signin`);
	}

	redirect(`/${session.userId}/settings`);
};

export default NewUserPage;
