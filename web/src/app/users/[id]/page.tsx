'use client';

import { useParams } from 'next/navigation';
import UserReviewsPage from '../_components/UserReviewsPage';

const UserPage = () => {
  const params = useParams();
  const userId = params?.id as string;

  return <UserReviewsPage userId={userId} />;
};

export default UserPage;
