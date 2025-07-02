import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeNotification } from '../../store/slices/uiSlice';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export const NotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(state => state.ui);

  useEffect(() => {
    notifications.forEach(notification => {
      if (!notification.read) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.slice(0, 3).map((notification) => {
        const Icon = iconMap[notification.type];
        
        return (
          <Transition
            key={notification.id}
            show={true}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${colorMap[notification.type]}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm opacity-90">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => dispatch(removeNotification(notification.id))}
                    className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        );
      })}
    </div>
  );
};