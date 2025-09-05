// Simple toast utility for frontend components
// Since @payloadcms/ui toast is mainly for admin, we'll create a simple notification system

export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

class ToastManager {
  private container: HTMLElement | null = null;

  private createContainer() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(this.container);
  }

  private createToast(options: ToastOptions) {
    this.createContainer();
    
    const toast = document.createElement('div');
    const { type, message, duration = 5000 } = options;
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };
    
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;
    
    this.container!.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message: string, duration?: number) {
    this.createToast({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.createToast({ type: 'error', message, duration });
  }

  info(message: string, duration?: number) {
    this.createToast({ type: 'info', message, duration });
  }

  warning(message: string, duration?: number) {
    this.createToast({ type: 'warning', message, duration });
  }
}

export const toast = new ToastManager();