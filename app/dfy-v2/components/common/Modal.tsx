import { motion } from 'framer-motion';
import { type ReactNode, useEffect, useRef } from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modelWidth?: string;
  className?: string;
  closeButtonClass?: string;
  isShowClose?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  modelWidth = 'w-full',
  className = '',
  closeButtonClass = '',
  isShowClose = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null); // Reference for the modal content

  // Close the modal if clicked outside of the modal content
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick); // Add event listener when modal is open
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // Cleanup event listener
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#222222cc]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={modalRef}
        className={cn(
          'container relative m-4 md:m-8 w-full ',
          modelWidth,
          className,
        )}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Close Button */}
        {isShowClose && (
          <button
            type="button"
            className={cn(
              'absolute font-gilroy right-2 top-2 rounded-full p-2 text-black',
              closeButtonClass,
            )}
            onClick={onClose}
          >
            X
          </button>
        )}

        {/* Modal Content */}
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
