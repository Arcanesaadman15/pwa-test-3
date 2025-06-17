import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { interactions } = useMicroInteractions();

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toastWithId = { ...newToast, id };
    
    setToasts(prev => [...prev, toastWithId]);
    
    // Trigger appropriate haptic feedback
    switch (newToast.variant) {
      case 'success':
        interactions.success();
        break;
      case 'error':
        interactions.error();
        break;
      default:
        interactions.notification();
    }

    // Auto dismiss after duration
    if (newToast.duration !== 0) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.duration || 5000);
    }
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastComponent({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { interactions, createSpringAnimation, prefersReducedMotion } = useMicroInteractions();

  const variants = {
    default: {
      bg: 'bg-gray-800 border-gray-700',
      icon: Info,
      iconColor: 'text-blue-400'
    },
    success: {
      bg: 'bg-green-800/90 border-green-600',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    },
    error: {
      bg: 'bg-red-800/90 border-red-600',
      icon: AlertCircle,
      iconColor: 'text-red-400'
    },
    warning: {
      bg: 'bg-orange-800/90 border-orange-600',
      icon: AlertTriangle,
      iconColor: 'text-orange-400'
    },
    info: {
      bg: 'bg-blue-800/90 border-blue-600',
      icon: Info,
      iconColor: 'text-blue-400'
    }
  };

  const variant = variants[toast.variant || 'default'];
  const Icon = variant.icon;

  const handleDismiss = () => {
    interactions.tap();
    onDismiss();
  };

  const handleAction = () => {
    interactions.tap();
    toast.action?.onClick();
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3 
      }}
      whileHover={prefersReducedMotion() ? {} : { scale: 1.02 }}
      className={`${variant.bg} border backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-sm w-full relative overflow-hidden`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex items-start space-x-3 relative z-10">
        <div className={`${variant.iconColor} mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              {toast.description}
            </p>
          )}
          
          {toast.action && (
            <motion.button
              onClick={handleAction}
              whileTap={prefersReducedMotion() ? {} : { scale: 0.95 }}
              className="mt-3 text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>
        
        <motion.button
          onClick={handleDismiss}
          whileTap={prefersReducedMotion() ? {} : { scale: 0.9 }}
          className="text-gray-400 hover:text-white transition-colors p-1 -mt-1 -mr-1"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-1 ${variant.iconColor.replace('text-', 'bg-')} opacity-60`}
        />
      )}
    </motion.div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
