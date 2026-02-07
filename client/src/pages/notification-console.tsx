import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, Settings, Download, Webhook, Activity, 
  CheckCircle, XCircle, Mail, Trash2, Plus, Send, RefreshCw
} from "lucide-react";
import { useLocation, Redirect } from "wouter";

const EVENT_TYPES = [
  "SITE_VISIT",
  "CONTRACT_VIEW", 
  "CONTRACT_SIGNED",
  "INFO_REQUEST",
  "AFFILIATE_CLICK",
  "AFFILIATE_SIGNUP"
];

interface Me {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface NotificationSettings {
  id: number;
  userId: number;
  enabled: boolean;
  emails: string[];
  events: Record<string, boolean>;
  delivery: string;
}

interface AuditLog {
  id: number;
  eventType: string;
  actorEmail: string;
  recipients: string;
  delivery: string;
  provider: string;
  success: boolean;
  error: string | null;
  hash: string;
  createdAt: string;
}

export default function NotificationConsole() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [emailInput, setEmailInput] = useState("");

  const { data: me, isLoading: meLoading } = useQuery<Me>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    staleTime: 60_000,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<NotificationSettings>({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const res = await fetch("/api/notification-settings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
    enabled: !!me,
    staleTime: 30_000,
  });

  const { data: auditLogs = [], isLoading: auditLoading } = useQuery<AuditLog[]>({
    queryKey: ["admin-audit"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return res.json();
    },
    enabled: !!me && (me.role === "admin" || me.role === "master"),
    staleTime: 30_000,
  });

  const { data: health } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const res = await fetch("/api/system/health");
      return res.json();
    },
    enabled: !!me && (me.role === "admin" || me.role === "master"),
    staleTime: 30_000,
  });

  const { data: queueStats } = useQuery({
    queryKey: ["queue-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/queue/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch queue stats");
      return res.json();
    },
    enabled: !!me && (me.role === "admin" || me.role === "master"),
    staleTime: 30_000,
  });

  const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        ...settings,
        events: settings.events || EVENT_TYPES.reduce((acc, e) => ({ ...acc, [e]: true }), {}),
        emails: settings.emails || []
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<NotificationSettings>) => {
      const res = await fetch("/api/notification-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Your notification preferences have been updated." });
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    },
  });

  const webhookTestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/webhook/test", {
        method: "POST",
        credentials: "include",
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: data.success ? "Webhook Test Passed" : "Webhook Test Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    },
  });

  const handleSave = () => {
    if (!localSettings) return;
    updateSettingsMutation.mutate({
      enabled: localSettings.enabled,
      emails: localSettings.emails,
      events: localSettings.events,
      delivery: localSettings.delivery,
    });
  };

  const handleAddEmail = () => {
    if (!localSettings || !emailInput.trim()) return;
    if (localSettings.emails.length >= 5) {
      toast({ title: "Limit reached", description: "Maximum 5 additional emails allowed", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setLocalSettings({
      ...localSettings,
      emails: [...localSettings.emails, emailInput.trim().toLowerCase()]
    });
    setEmailInput("");
  };

  const handleRemoveEmail = (email: string) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      emails: localSettings.emails.filter(e => e !== email)
    });
  };

  const handleToggleEvent = (event: string) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      events: {
        ...localSettings.events,
        [event]: !localSettings.events[event]
      }
    });
  };

  useEffect(() => {
    if (!meLoading && !me) {
      setLocation("/admin/login");
    }
  }, [me, meLoading, setLocation]);

  if (meLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!me) return <Redirect to="/admin/login" />;

  const isAdmin = me.role === "admin" || me.role === "master";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">Notification Console</h1>
            <p className="text-gray-600">Manage your notification preferences and view system status</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="settings-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="enabled"
                  checked={localSettings?.enabled ?? true}
                  onCheckedChange={(checked) => 
                    localSettings && setLocalSettings({ ...localSettings, enabled: !!checked })
                  }
                  data-testid="checkbox-enabled"
                />
                <label htmlFor="enabled" className="text-sm font-medium">
                  Enable Notifications
                </label>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Events to Track</h4>
                <div className="grid grid-cols-2 gap-2">
                  {EVENT_TYPES.map((event) => (
                    <div key={event} className="flex items-center gap-2">
                      <Checkbox
                        id={`event-${event}`}
                        checked={localSettings?.events?.[event] ?? true}
                        onCheckedChange={() => handleToggleEvent(event)}
                        data-testid={`checkbox-event-${event}`}
                      />
                      <label htmlFor={`event-${event}`} className="text-sm">
                        {event.replace(/_/g, " ")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Additional Email Recipients (max 5)</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {localSettings?.emails?.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1" data-testid={`email-chip-${email}`}>
                      <Mail className="w-3 h-3" />
                      {email}
                      <button onClick={() => handleRemoveEmail(email)} className="ml-1 hover:text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Add email recipient"
                    onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                    data-testid="input-add-email"
                  />
                  <Button onClick={handleAddEmail} size="sm" data-testid="button-add-email">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Delivery Mode</h4>
                <Select
                  value={localSettings?.delivery ?? "instant"}
                  onValueChange={(value) => 
                    localSettings && setLocalSettings({ ...localSettings, delivery: value })
                  }
                  data-testid="select-delivery"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={updateSettingsMutation.isPending}
                className="w-full"
                data-testid="button-save-settings"
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <div className="space-y-6">
              <Card data-testid="system-health-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Database</div>
                      <div className="flex items-center gap-2 mt-1">
                        {health?.db === "up" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">{health?.db === "up" ? "Connected" : "Disconnected"}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Queue Status</div>
                      <div className="mt-1">
                        <span className="font-medium">{queueStats?.pendingCount ?? 0}</span>
                        <span className="text-gray-600 text-sm"> pending</span>
                        {queueStats?.failingCount > 0 && (
                          <Badge variant="destructive" className="ml-2">{queueStats.failingCount} failing</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="webhook-tester-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="w-5 h-5" />
                    Webhook Tester
                  </CardTitle>
                  <CardDescription>Test the webhook endpoint for failover notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => webhookTestMutation.mutate()}
                    disabled={webhookTestMutation.isPending}
                    data-testid="button-test-webhook"
                  >
                    {webhookTestMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Fire Test Webhook
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {isAdmin && (
          <Card className="mt-6" data-testid="audit-logs-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Audit Logs
                  </CardTitle>
                  <CardDescription>View notification delivery history with hash chain verification</CardDescription>
                </div>
                <Button variant="outline" asChild data-testid="button-download-csv">
                  <a href="/api/admin/export/audit" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No audit logs yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Time</th>
                        <th className="text-left py-3 px-2">Event</th>
                        <th className="text-left py-3 px-2">Recipient</th>
                        <th className="text-left py-3 px-2">Provider</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.slice(0, 50).map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50" data-testid={`audit-row-${log.id}`}>
                          <td className="py-2 px-2 text-gray-600">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2 px-2">
                            <Badge variant="outline">{log.eventType}</Badge>
                          </td>
                          <td className="py-2 px-2 truncate max-w-[200px]" title={log.recipients}>
                            {log.recipients}
                          </td>
                          <td className="py-2 px-2">{log.provider}</td>
                          <td className="py-2 px-2">
                            {log.success ? (
                              <Badge className="bg-green-100 text-green-800">OK</Badge>
                            ) : (
                              <Badge variant="destructive">FAIL</Badge>
                            )}
                          </td>
                          <td className="py-2 px-2 font-mono text-xs text-gray-500">
                            {log.hash.slice(0, 10)}…
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
