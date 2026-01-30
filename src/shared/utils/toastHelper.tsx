import { toast } from 'sonner'
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiInformationLine,
} from 'react-icons/ri'


/**
 * Toast Helper
 * Wrapper around sonner to enforce consistent design and NO EMOJIS.
 */
export const toastHelper = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      icon: <RiCheckboxCircleLine className="size-5" />,
      duration: 4000,
    })
  },

  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      icon: <RiErrorWarningLine className="size-5" />,
      duration: 5000,
    })
  },

  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      icon: <RiAlertLine className="size-5" />,
      duration: 5000,
    })
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      icon: <RiInformationLine className="size-5" />,
      duration: 4000,
    })
  },
}
