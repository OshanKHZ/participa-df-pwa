'use client';

import { useEffect } from 'react';
import {
  RiCloseLine,
  RiDownloadLine,
  RiWifiLine,
  RiSmartphoneLine,
  RiFlashlightLine,
  RiNotification3Line,
} from 'react-icons/ri';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function InstallModal({ isOpen, onClose, onConfirm }: InstallModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <RiDownloadLine className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <h2 id="install-modal-title" className="text-lg font-semibold text-gray-900">
                Instalar Participa-DF
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label="Fechar modal"
            >
              <RiCloseLine className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Instale o aplicativo na tela inicial do seu dispositivo para uma experiência melhor:
            </p>

            {/* Benefits list */}
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiWifiLine className="w-4 h-4 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Acesso offline</h3>
                  <p className="text-xs text-gray-600">
                    Use mesmo sem conexão com a internet
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiSmartphoneLine className="w-4 h-4 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Ícone na tela inicial</h3>
                  <p className="text-xs text-gray-600">
                    Acesso rápido como um aplicativo nativo
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiFlashlightLine className="w-4 h-4 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Carregamento rápido</h3>
                  <p className="text-xs text-gray-600">
                    Performance otimizada para seu dispositivo
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiNotification3Line className="w-4 h-4 text-orange-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notificações (em breve)</h3>
                  <p className="text-xs text-gray-600">
                    Receba atualizações sobre suas manifestações
                  </p>
                </div>
              </li>
            </ul>

            <div className="pt-2 text-xs text-gray-500">
              <p>
                <strong>Nota:</strong> O aplicativo ocupa menos de 1MB e pode ser desinstalado a qualquer momento.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Agora não
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Confirmar instalação
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
