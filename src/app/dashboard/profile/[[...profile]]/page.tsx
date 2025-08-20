'use client';

import { UserProfile } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const UserProfilePage = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  return (
     <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
    >
       <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Manage Your Profile</h1>
        <p className="text-muted-foreground">Easily update your personal information and manage your account settings.</p>
      </motion.div>
      <div className="flex justify-center">
        <UserProfile
          path="/dashboard/profile"
          routing="path"
          appearance={{
            elements: {
              card: 'shadow-none',
              rootBox: 'w-full',
            },
          }}
        >
          <UserProfile.Page label="Billing" url="billing" labelIcon={<span>💳</span>}>
            {/* Custom billing page content can go here */}
          </UserProfile.Page>
        </UserProfile>
      </div>
    </motion.div>
  );
};

export default UserProfilePage;
