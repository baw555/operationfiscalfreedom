import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, FileText, CheckCircle, Clock, Download, Copy, ExternalLink } from "lucide-react";

interface CsuContractTemplate {
  id: number;
  name: string;
  description: string | null;
  content: string;
  isActive: boolean;
}

interface CsuContractSend {
  id: number;
  templateId: number;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string | null;
  signToken: string;
  tokenExpiresAt: string;
  status: string;
  sentAt: string;
}

interface CsuSignedAgreement {
  id: number;
  contractSendId: number;
  templateId: number;
  signerName: string;
  signerEmail: string;
  signerPhone: string | null;
  address: string | null;
  signedAt: string;
}

export default function CsuPortal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("send");
  const [formData, setFormData] = useState({
    templateId: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
  });
  const [lastSigningUrl, setLastSigningUrl] = useState<string | null>(null);

  const { data: templates = [] } = useQuery<CsuContractTemplate[]>({
    queryKey: ["/api/csu/templates"],
  });

  const { data: contractSends = [] } = useQuery<CsuContractSend[]>({
    queryKey: ["/api/csu/contract-sends"],
  });

  const { data: signedAgreements = [] } = useQuery<CsuSignedAgreement[]>({
    queryKey: ["/api/csu/signed-agreements"],
  });

  const sendContractMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/csu/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          templateId: parseInt(data.templateId),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send contract");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Contract Sent",
        description: data.message || "Contract has been sent successfully.",
      });
      setLastSigningUrl(data.signingUrl);
      setFormData({ templateId: "", recipientName: "", recipientEmail: "", recipientPhone: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/csu/contract-sends"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.templateId || !formData.recipientName || !formData.recipientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in template, name, and email.",
        variant: "destructive",
      });
      return;
    }
    sendContractMutation.mutate(formData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  const getSigningUrl = (token: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/csu-sign?token=${token}`;
  };

  return (
    <Layout>
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-display mb-4">Cost Savings University</h1>
          <p className="text-lg text-blue-200">Contract Management Portal</p>
        </div>
      </section>

      <section className="py-8 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="send" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-send">
                <Send className="w-4 h-4 mr-2" /> Send Contract
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-pending">
                <Clock className="w-4 h-4 mr-2" /> Pending ({contractSends.filter(s => s.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="signed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-signed">
                <CheckCircle className="w-4 h-4 mr-2" /> Signed ({signedAgreements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" /> Send a New Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="template">Contract Template *</Label>
                      <Select
                        value={formData.templateId}
                        onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                      >
                        <SelectTrigger data-testid="select-template">
                          <SelectValue placeholder="Select a contract template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        placeholder="John Doe"
                        className="text-brand-navy"
                        data-testid="input-recipient-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">Recipient Email *</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        placeholder="john@example.com"
                        className="text-brand-navy"
                        data-testid="input-recipient-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone">Recipient Phone (Optional)</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        value={formData.recipientPhone}
                        onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="text-brand-navy"
                        data-testid="input-recipient-phone"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={sendContractMutation.isPending}
                      data-testid="button-send-contract"
                    >
                      {sendContractMutation.isPending ? "Sending..." : "Send Contract"}
                    </Button>
                  </form>

                  {lastSigningUrl && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium mb-2">Contract Sent! Signing Link:</p>
                      <div className="flex items-center gap-2">
                        <Input value={lastSigningUrl} readOnly className="text-sm text-brand-navy" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(lastSigningUrl)}
                          data-testid="button-copy-link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(lastSigningUrl, "_blank")}
                          data-testid="button-open-link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Pending Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contractSends.filter(s => s.status === "pending").length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending contracts</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Recipient</th>
                            <th className="text-left py-3 px-4">Email</th>
                            <th className="text-left py-3 px-4">Sent</th>
                            <th className="text-left py-3 px-4">Expires</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contractSends.filter(s => s.status === "pending").map((send) => (
                            <tr key={send.id} className="border-b hover:bg-gray-50" data-testid={`pending-row-${send.id}`}>
                              <td className="py-3 px-4">{send.recipientName}</td>
                              <td className="py-3 px-4">{send.recipientEmail}</td>
                              <td className="py-3 px-4">{new Date(send.sentAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">{new Date(send.tokenExpiresAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(getSigningUrl(send.signToken))}
                                >
                                  <Copy className="w-4 h-4 mr-1" /> Copy Link
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signed">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Signed Agreements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {signedAgreements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No signed agreements yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Name</th>
                            <th className="text-left py-3 px-4">Email</th>
                            <th className="text-left py-3 px-4">Phone</th>
                            <th className="text-left py-3 px-4">Signed</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {signedAgreements.map((agreement) => (
                            <tr key={agreement.id} className="border-b hover:bg-gray-50" data-testid={`signed-row-${agreement.id}`}>
                              <td className="py-3 px-4">{agreement.signerName}</td>
                              <td className="py-3 px-4">{agreement.signerEmail}</td>
                              <td className="py-3 px-4">{agreement.signerPhone || "-"}</td>
                              <td className="py-3 px-4">{new Date(agreement.signedAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/api/csu/signed-agreements/${agreement.id}/pdf`, "_blank")}
                                  data-testid={`download-agreement-${agreement.id}`}
                                >
                                  <Download className="w-4 h-4 mr-1" /> Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
