'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function WalletScreenTransition({
                                                   children,
                                               }: {
    children: ReactNode;
}) {
    return (
        <motion.div
            initial={{ x: '100%', opacity: 0.98 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                type: 'tween',
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="min-h-full w-full"
        >
            {children}
        </motion.div>
    );
}