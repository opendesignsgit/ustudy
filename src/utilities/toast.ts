// Frontend toast utility using a simple implementation since PayloadCMS toast is for admin panel
"use client";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastManager {
  private container: HTMLElement | null = null;
  private toasts: Set<HTMLElement> = new Set();

  private createContainer() {
    if (this.container) return this.container;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
    return this.container;
  }

  private createToast(message: string, type: ToastType, options: ToastOptions = {}) {
    const { duration = 4000 } = options;
    const container = this.createContainer();

    const toast = document.createElement('div');
    const colors = {
      success: '#10b981',
      error: '#ef4444', 
      info: '#3b82f6',
      warning: '#f59e0b'
    };

    toast.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 400px;
      word-wrap: break-word;
      pointer-events: auto;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-size: 14px;
      line-height: 1.4;
    `;
    
    toast.textContent = message;
    container.appendChild(toast);
    this.toasts.add(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    // Click to dismiss
    toast.addEventListener('click', () => {
      this.removeToast(toast);
    });

    return toast;
  }

  private removeToast(toast: HTMLElement) {
    if (!this.toasts.has(toast)) return;
    
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(toast);
      
      if (this.toasts.size === 0 && this.container) {
        document.body.removeChild(this.container);
        this.container = null;
      }
    }, 300);
  }

  success(message: string, options?: ToastOptions) {
    return this.createToast(message, 'success', options);
  }

  error(message: string, options?: ToastOptions) {
    return this.createToast(message, 'error', options);
  }

  info(message: string, options?: ToastOptions) {
    return this.createToast(message, 'info', options);
  }

  warning(message: string, options?: ToastOptions) {
    return this.createToast(message, 'warning', options);
  }
}

export const toast = new ToastManager();