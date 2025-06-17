'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent, requiredUserType) => {
  return function WithAuthComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const userType = localStorage.getItem('userType');
      const userId = localStorage.getItem('userId');

      if (!userId || !userType) {
        router.push('/');
        return;
      }

      // Check if user type matches required type
      if (requiredUserType && userType !== requiredUserType) {
        // Redirect based on user type
        if (userType === 'pasien') {
          router.push('/homePasien');
        } else if (userType === 'dokter') {
          router.push('/homeDokter');
        } else {
          router.push('/');
        }
        return;
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 