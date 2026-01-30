'use client';

import { useState } from 'react';
import { RiCloseLine, RiDownloadLine, RiSmartphoneLine } from 'react-icons/ri';
import { InstallModal } from './InstallModal';

interface InstallPromptBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPromptBanner({ onInstall, onDismiss }: InstallPromptBannerProps) {
  const [showModal, setShowModal] = useState(false);

  const handleInstallClick = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    onInstall();
  };

  return (
    <>
      {/* Banner - Mobile only */}
      <div
        role="banner"
        aria-label="Prompt de instalação do aplicativo"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg animate-slide-up md:hidden"
      >
        <div className="relative px-4 py-4">
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            aria-label="Dispensar instalação"
          >
            <RiCloseLine className="w-4 h-4 text-gray-500" aria-hidden="true" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 pr-8">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <RiSmartphoneLine className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Instale o Participa-DF
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Acesse offline, tenha um ícone na tela inicial e receba notificações sobre suas manifestações.
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onDismiss}
                  className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Agora não
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center gap-1.5"
                >
                  <RiDownloadLine className="w-3.5 h-3.5" aria-hidden="true" />
                  Instalar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Install Modal */}
      <InstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}
