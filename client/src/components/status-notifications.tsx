import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle, Bell } from "lucide-react";

type NotificationType = "success" | "warning" | "info" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (title: string, message: string, duration?: number) => {
    addNotification({ type: "success", title, message, duration });
  };

  const warning = (title: string, message: string, duration?: number) => {
    addNotification({ type: "warning", title, message, duration });
  };

  const info = (title: string, message: string, duration?: number) => {
    addNotification({ type: "info", title, message, duration });
  };

  const error = (title: string, message: string, duration?: number) => {
    addNotification({ type: "error", title, message, duration: duration || 8000 });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, success, warning, info, error }}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={removeNotification} />
    </NotificationContext.Provider>
  );
}

function NotificationContainer({ notifications, onDismiss }: { notifications: Notification[]; onDismiss: (id: string) => void }) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md" data-testid="notification-container">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function NotificationToast({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 200);
  };

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-500",
      titleColor: "text-green-800"
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      titleColor: "text-yellow-800"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-500",
      titleColor: "text-blue-800"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-500",
      titleColor: "text-red-800"
    }
  };

  const style = styles[notification.type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-xl shadow-lg overflow-hidden ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}
      data-testid={`notification-${notification.id}`}
    >
      <div className="p-4 flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm ${style.titleColor}`}>{notification.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium text-[#1A365D] hover:text-[#E21C3D] transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          data-testid="notification-dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
        .animate-slide-out { animation: slide-out 0.2s ease-in forwards; }
      `}</style>
    </div>
  );
}

export function NotificationBell() {
  const [showHistory, setShowHistory] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [history, setHistory] = useState<Array<{ id: string; type: NotificationType; title: string; message: string; time: Date }>>([]);

  useEffect(() => {
    const stored = localStorage.getItem("notification_history");
    if (stored) {
      const parsed = JSON.parse(stored);
      setHistory(parsed.slice(-10));
      setUnreadCount(parsed.filter((n: any) => !n.read).length);
    }
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
    const updated = history.map(n => ({ ...n, read: true }));
    localStorage.setItem("notification_history", JSON.stringify(updated));
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setShowHistory(!showHistory); markAllRead(); }}
        className="relative p-2 text-gray-600 hover:text-[#1A365D] transition-colors"
        data-testid="notification-bell"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E21C3D] text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {showHistory && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="bg-[#1A365D] text-white px-4 py-3 font-bold">
            Recent Notifications
          </div>
          <div className="max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              history.map((item, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <div className="font-medium text-sm text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
