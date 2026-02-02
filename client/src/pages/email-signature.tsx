import { useState, useRef } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook,
  MapPin,
  Building,
  Sparkles,
  Palette,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignatureData {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  photoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  template: "modern" | "classic" | "minimal" | "bold";
}

const colorPresets = [
  { name: "Navy", primary: "#1e3a5f", secondary: "#3b82f6" },
  { name: "Crimson", primary: "#dc2626", secondary: "#f97316" },
  { name: "Forest", primary: "#166534", secondary: "#22c55e" },
  { name: "Purple", primary: "#7c3aed", secondary: "#a855f7" },
  { name: "Slate", primary: "#334155", secondary: "#64748b" },
  { name: "Gold", primary: "#b45309", secondary: "#f59e0b" },
];

export default function EmailSignature() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<SignatureData>({
    fullName: "John Smith",
    jobTitle: "Senior Marketing Manager",
    company: "Acme Corporation",
    email: "john.smith@acme.com",
    phone: "(555) 123-4567",
    website: "www.acme.com",
    address: "123 Business Ave, New York, NY",
    linkedin: "johnsmith",
    twitter: "johnsmith",
    instagram: "",
    facebook: "",
    photoUrl: "",
    primaryColor: "#1e3a5f",
    secondaryColor: "#3b82f6",
    template: "modern"
  });

  const updateField = (field: keyof SignatureData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generateSignatureHTML = () => {
    const { fullName, jobTitle, company, email, phone, website, address, linkedin, twitter, instagram, facebook, photoUrl, primaryColor, secondaryColor } = data;
    
    const socialLinks = [];
    if (linkedin) socialLinks.push(`<a href="https://linkedin.com/in/${linkedin}" style="text-decoration:none;margin-right:8px;"><img src="https://cdn-icons-png.flaticon.com/24/174/174857.png" width="20" height="20" alt="LinkedIn" style="vertical-align:middle;"/></a>`);
    if (twitter) socialLinks.push(`<a href="https://twitter.com/${twitter}" style="text-decoration:none;margin-right:8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" width="20" height="20" alt="Twitter" style="vertical-align:middle;"/></a>`);
    if (instagram) socialLinks.push(`<a href="https://instagram.com/${instagram}" style="text-decoration:none;margin-right:8px;"><img src="https://cdn-icons-png.flaticon.com/24/174/174855.png" width="20" height="20" alt="Instagram" style="vertical-align:middle;"/></a>`);
    if (facebook) socialLinks.push(`<a href="https://facebook.com/${facebook}" style="text-decoration:none;margin-right:8px;"><img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" width="20" height="20" alt="Facebook" style="vertical-align:middle;"/></a>`);

    if (data.template === "modern") {
      return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
  <tr>
    <td style="padding-right:15px;border-right:3px solid ${primaryColor};">
      ${photoUrl ? `<img src="${photoUrl}" width="80" height="80" style="border-radius:50%;object-fit:cover;" alt="${fullName}"/>` : 
      `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,${primaryColor},${secondaryColor});display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:bold;">${fullName.split(' ').map(n => n[0]).join('')}</div>`}
    </td>
    <td style="padding-left:15px;">
      <div style="font-size:18px;font-weight:bold;color:${primaryColor};margin-bottom:2px;">${fullName}</div>
      <div style="font-size:13px;color:#666;margin-bottom:8px;">${jobTitle}${company ? ` | ${company}` : ''}</div>
      <table cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#444;">
        ${email ? `<tr><td style="padding:2px 8px 2px 0;"><span style="color:${secondaryColor};">✉</span></td><td><a href="mailto:${email}" style="color:#444;text-decoration:none;">${email}</a></td></tr>` : ''}
        ${phone ? `<tr><td style="padding:2px 8px 2px 0;"><span style="color:${secondaryColor};">📱</span></td><td><a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color:#444;text-decoration:none;">${phone}</a></td></tr>` : ''}
        ${website ? `<tr><td style="padding:2px 8px 2px 0;"><span style="color:${secondaryColor};">🌐</span></td><td><a href="https://${website.replace(/^https?:\/\//, '')}" style="color:${secondaryColor};text-decoration:none;">${website}</a></td></tr>` : ''}
        ${address ? `<tr><td style="padding:2px 8px 2px 0;"><span style="color:${secondaryColor};">📍</span></td><td style="color:#666;">${address}</td></tr>` : ''}
      </table>
      ${socialLinks.length > 0 ? `<div style="margin-top:8px;">${socialLinks.join('')}</div>` : ''}
    </td>
  </tr>
</table>`.trim();
    }
    
    if (data.template === "classic") {
      return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,serif;font-size:14px;line-height:1.6;">
  <tr>
    <td>
      <div style="font-size:20px;font-weight:bold;color:${primaryColor};border-bottom:2px solid ${secondaryColor};padding-bottom:5px;margin-bottom:8px;">${fullName}</div>
      <div style="font-size:14px;font-style:italic;color:#555;margin-bottom:10px;">${jobTitle}${company ? `, ${company}` : ''}</div>
      <div style="font-size:12px;color:#666;">
        ${email ? `<div style="margin-bottom:3px;">Email: <a href="mailto:${email}" style="color:${primaryColor};">${email}</a></div>` : ''}
        ${phone ? `<div style="margin-bottom:3px;">Phone: <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color:${primaryColor};">${phone}</a></div>` : ''}
        ${website ? `<div style="margin-bottom:3px;">Web: <a href="https://${website.replace(/^https?:\/\//, '')}" style="color:${primaryColor};">${website}</a></div>` : ''}
        ${address ? `<div style="margin-bottom:3px;">${address}</div>` : ''}
      </div>
      ${socialLinks.length > 0 ? `<div style="margin-top:10px;">${socialLinks.join('')}</div>` : ''}
    </td>
  </tr>
</table>`.trim();
    }

    if (data.template === "minimal") {
      return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.4;color:#333;">
  <tr>
    <td>
      <div style="font-weight:600;color:${primaryColor};">${fullName}</div>
      <div style="font-size:12px;color:#888;margin-bottom:6px;">${jobTitle}${company ? ` · ${company}` : ''}</div>
      <div style="font-size:12px;color:#666;">
        ${[email, phone, website].filter(Boolean).map((item, i) => {
          if (item === email) return `<a href="mailto:${email}" style="color:${secondaryColor};text-decoration:none;">${email}</a>`;
          if (item === phone) return `<a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color:#666;text-decoration:none;">${phone}</a>`;
          if (item === website) return `<a href="https://${website.replace(/^https?:\/\//, '')}" style="color:${secondaryColor};text-decoration:none;">${website}</a>`;
          return '';
        }).join(' | ')}
      </div>
    </td>
  </tr>
</table>`.trim();
    }

    // Bold template
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;">
  <tr>
    <td style="background:linear-gradient(135deg,${primaryColor},${secondaryColor});padding:15px;border-radius:8px;">
      <div style="color:white;">
        <div style="font-size:22px;font-weight:bold;margin-bottom:3px;">${fullName}</div>
        <div style="font-size:14px;opacity:0.9;margin-bottom:10px;">${jobTitle}${company ? ` | ${company}` : ''}</div>
        <div style="font-size:12px;opacity:0.85;">
          ${email ? `<div style="margin-bottom:3px;">✉ <a href="mailto:${email}" style="color:white;">${email}</a></div>` : ''}
          ${phone ? `<div style="margin-bottom:3px;">📱 ${phone}</div>` : ''}
          ${website ? `<div>🌐 <a href="https://${website.replace(/^https?:\/\//, '')}" style="color:white;">${website}</a></div>` : ''}
        </div>
      </div>
    </td>
  </tr>
</table>`.trim();
  };

  const copyToClipboard = async () => {
    const html = generateSignatureHTML();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([html], { type: 'text/plain' })
        })
      ]);
      setCopied(true);
      toast({
        title: "Signature copied!",
        description: "Paste it in Gmail Settings > Signature",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to plain text copy
      await navigator.clipboard.writeText(html);
      setCopied(true);
      toast({
        title: "HTML copied!",
        description: "Paste the HTML code in Gmail signature settings",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Email Signature Generator
              </h1>
              <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Create a professional, animated email signature for Gmail in seconds
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-400" />
                  Customize Your Signature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full bg-slate-700/50 mb-6">
                    <TabsTrigger value="info" className="flex-1" data-testid="tab-info">Info</TabsTrigger>
                    <TabsTrigger value="contact" className="flex-1" data-testid="tab-contact">Contact</TabsTrigger>
                    <TabsTrigger value="social" className="flex-1" data-testid="tab-social">Social</TabsTrigger>
                    <TabsTrigger value="style" className="flex-1" data-testid="tab-style">Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Full Name</Label>
                      <Input
                        value={data.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="John Smith"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-fullname"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Job Title</Label>
                      <Input
                        value={data.jobTitle}
                        onChange={(e) => updateField("jobTitle", e.target.value)}
                        placeholder="Marketing Manager"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-jobtitle"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Company</Label>
                      <Input
                        value={data.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Acme Corporation"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-company"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Photo URL (optional)</Label>
                      <Input
                        value={data.photoUrl}
                        onChange={(e) => updateField("photoUrl", e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-photo"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        value={data.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@company.com"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone
                      </Label>
                      <Input
                        value={data.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Website
                      </Label>
                      <Input
                        value={data.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        placeholder="www.company.com"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-website"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Address
                      </Label>
                      <Input
                        value={data.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="123 Main St, City, State"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-address"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4">
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Linkedin className="h-4 w-4" /> LinkedIn Username
                      </Label>
                      <Input
                        value={data.linkedin}
                        onChange={(e) => updateField("linkedin", e.target.value)}
                        placeholder="johnsmith"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-linkedin"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Twitter className="h-4 w-4" /> Twitter/X Username
                      </Label>
                      <Input
                        value={data.twitter}
                        onChange={(e) => updateField("twitter", e.target.value)}
                        placeholder="johnsmith"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-twitter"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Instagram className="h-4 w-4" /> Instagram Username
                      </Label>
                      <Input
                        value={data.instagram}
                        onChange={(e) => updateField("instagram", e.target.value)}
                        placeholder="johnsmith"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-instagram"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Facebook className="h-4 w-4" /> Facebook Username
                      </Label>
                      <Input
                        value={data.facebook}
                        onChange={(e) => updateField("facebook", e.target.value)}
                        placeholder="johnsmith"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        data-testid="input-facebook"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-6">
                    <div>
                      <Label className="text-slate-300 mb-3 block">Template Style</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["modern", "classic", "minimal", "bold"] as const).map((template) => (
                          <button
                            key={template}
                            onClick={() => updateField("template", template)}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 capitalize ${
                              data.template === template
                                ? "border-blue-500 bg-blue-500/20 text-white"
                                : "border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500"
                            }`}
                            data-testid={`template-${template}`}
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-3 block">Color Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              updateField("primaryColor", preset.primary);
                              updateField("secondaryColor", preset.secondary);
                            }}
                            className="p-3 rounded-lg border border-slate-600 hover:border-slate-400 transition-all"
                            style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                            data-testid={`color-${preset.name.toLowerCase()}`}
                          >
                            <span className="text-white text-sm font-medium drop-shadow">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Primary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            value={data.primaryColor}
                            onChange={(e) => updateField("primaryColor", e.target.value)}
                            className="h-10 w-14 rounded cursor-pointer"
                            data-testid="color-primary"
                          />
                          <Input
                            value={data.primaryColor}
                            onChange={(e) => updateField("primaryColor", e.target.value)}
                            className="bg-slate-700/50 border-slate-600 text-white flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-slate-300">Secondary Color</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            value={data.secondaryColor}
                            onChange={(e) => updateField("secondaryColor", e.target.value)}
                            className="h-10 w-14 rounded cursor-pointer"
                            data-testid="color-secondary"
                          />
                          <Input
                            value={data.secondaryColor}
                            onChange={(e) => updateField("secondaryColor", e.target.value)}
                            className="bg-slate-700/50 border-slate-600 text-white flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-400" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={signatureRef}
                    className="bg-white rounded-lg p-6 min-h-[200px] animate-in fade-in duration-500"
                    data-testid="signature-preview"
                  >
                    <SignaturePreview data={data} />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={copyToClipboard}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                data-testid="button-copy"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy Signature for Gmail
                  </>
                )}
              </Button>

              <Card className="bg-slate-800/30 border-slate-700">
                <CardContent className="pt-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-400" />
                    How to Add to Gmail
                  </h3>
                  <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
                    <li>Click "Copy Signature for Gmail" above</li>
                    <li>Open Gmail and go to Settings (gear icon)</li>
                    <li>Click "See all settings"</li>
                    <li>Scroll down to "Signature" section</li>
                    <li>Create a new signature or edit existing</li>
                    <li>Paste (Ctrl+V or Cmd+V) in the signature box</li>
                    <li>Scroll down and click "Save Changes"</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SignaturePreview({ data }: { data: SignatureData }) {
  const { fullName, jobTitle, company, email, phone, website, address, linkedin, twitter, instagram, facebook, photoUrl, primaryColor, secondaryColor, template } = data;
  
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();

  if (template === "modern") {
    return (
      <div className="flex items-start gap-4 animate-in slide-in-from-left duration-500">
        <div 
          className="shrink-0 border-r-4 pr-4 transition-all duration-300"
          style={{ borderColor: primaryColor }}
        >
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 transition-all duration-300 hover:scale-105"
              style={{ ringColor: secondaryColor }}
            />
          ) : (
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 hover:scale-105 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div 
            className="text-lg font-bold transition-colors duration-300"
            style={{ color: primaryColor }}
          >
            {fullName}
          </div>
          <div className="text-sm text-gray-600">
            {jobTitle}{company && ` | ${company}`}
          </div>
          <div className="text-xs space-y-1 text-gray-700">
            {email && (
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span style={{ color: secondaryColor }}>✉</span>
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span style={{ color: secondaryColor }}>📱</span>
                <span>{phone}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span style={{ color: secondaryColor }}>🌐</span>
                <a href={`https://${website}`} style={{ color: secondaryColor }} className="hover:underline">{website}</a>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                <span style={{ color: secondaryColor }}>📍</span>
                <span className="text-gray-500">{address}</span>
              </div>
            )}
          </div>
          <SocialIcons linkedin={linkedin} twitter={twitter} instagram={instagram} facebook={facebook} />
        </div>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="animate-in fade-in duration-500">
        <div 
          className="text-xl font-bold border-b-2 pb-2 mb-2 transition-all duration-300"
          style={{ color: primaryColor, borderColor: secondaryColor }}
        >
          {fullName}
        </div>
        <div className="text-sm italic text-gray-600 mb-3">
          {jobTitle}{company && `, ${company}`}
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          {email && <div>Email: <a href={`mailto:${email}`} style={{ color: primaryColor }}>{email}</a></div>}
          {phone && <div>Phone: <a href={`tel:${phone}`} style={{ color: primaryColor }}>{phone}</a></div>}
          {website && <div>Web: <a href={`https://${website}`} style={{ color: primaryColor }}>{website}</a></div>}
          {address && <div>{address}</div>}
        </div>
        <SocialIcons linkedin={linkedin} twitter={twitter} instagram={instagram} facebook={facebook} />
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="font-semibold" style={{ color: primaryColor }}>{fullName}</div>
        <div className="text-xs text-gray-500 mb-2">
          {jobTitle}{company && ` · ${company}`}
        </div>
        <div className="text-xs text-gray-600">
          {[email, phone, website].filter(Boolean).map((item, i, arr) => (
            <span key={i}>
              {item === email ? <a href={`mailto:${email}`} style={{ color: secondaryColor }}>{email}</a> : 
               item === website ? <a href={`https://${website}`} style={{ color: secondaryColor }}>{website}</a> : 
               item}
              {i < arr.length - 1 && " | "}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Bold template
  return (
    <div 
      className="p-4 rounded-lg text-white animate-in zoom-in duration-500"
      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
    >
      <div className="text-xl font-bold mb-1">{fullName}</div>
      <div className="text-sm opacity-90 mb-3">
        {jobTitle}{company && ` | ${company}`}
      </div>
      <div className="text-xs opacity-85 space-y-1">
        {email && <div>✉ <a href={`mailto:${email}`} className="text-white hover:underline">{email}</a></div>}
        {phone && <div>📱 {phone}</div>}
        {website && <div>🌐 <a href={`https://${website}`} className="text-white hover:underline">{website}</a></div>}
      </div>
    </div>
  );
}

function SocialIcons({ linkedin, twitter, instagram, facebook }: { linkedin?: string; twitter?: string; instagram?: string; facebook?: string }) {
  const hasAny = linkedin || twitter || instagram || facebook;
  if (!hasAny) return null;
  
  return (
    <div className="flex gap-2 mt-2">
      {linkedin && (
        <a href={`https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <Linkedin className="h-5 w-5 text-[#0077b5]" />
        </a>
      )}
      {twitter && (
        <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <Twitter className="h-5 w-5 text-[#1da1f2]" />
        </a>
      )}
      {instagram && (
        <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <Instagram className="h-5 w-5 text-[#e4405f]" />
        </a>
      )}
      {facebook && (
        <a href={`https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <Facebook className="h-5 w-5 text-[#1877f2]" />
        </a>
      )}
    </div>
  );
}
