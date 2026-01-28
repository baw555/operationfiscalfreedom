import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileSignature, CheckCircle, AlertTriangle, Camera, Upload, X, RefreshCw } from "lucide-react";

export default function AffiliateNda() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingStreamRef = useRef<MediaStream | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState<string>("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    veteranNumber: "",
    address: "",
    customReferralCode: "",
    agreedToTerms: false,
  });

  // Start webcam for face capture
  const startCamera = useCallback(async () => {
    try {
      // Use flexible constraints that work on most devices
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        } 
      });
      
      // Store stream and set camera active - useEffect will handle attachment
      pendingStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      let message = "Please allow camera access to capture your face photo.";
      if (err.name === "NotFoundError") {
        message = "No camera found on this device.";
      } else if (err.name === "NotAllowedError") {
        message = "Camera permission denied. Please enable camera access in your browser settings.";
      } else if (err.name === "NotReadableError") {
        message = "Camera is in use by another application.";
      }
      toast({ 
        title: "Camera Access Failed", 
        description: message,
        variant: "destructive" 
      });
    }
  }, [toast]);

  // Attach stream to video element after it becomes visible
  useEffect(() => {
    if (isCameraActive && pendingStreamRef.current && videoRef.current) {
      const video = videoRef.current;
      const stream = pendingStreamRef.current;
      
      video.srcObject = stream;
      
      // Wait for video metadata to load before playing
      video.onloadedmetadata = async () => {
        try {
          await video.play();
        } catch (playErr) {
          console.error("Video play failed:", playErr);
          toast({ 
            title: "Camera Error", 
            description: "Could not start video preview. Please try again.",
            variant: "destructive" 
          });
          // Stop stream and reset
          stream.getTracks().forEach(track => track.stop());
          pendingStreamRef.current = null;
          setIsCameraActive(false);
        }
      };
      
      // Clear pending stream ref after attachment
      pendingStreamRef.current = null;
    }
  }, [isCameraActive, toast]);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  // Capture face photo from webcam
  const captureFacePhoto = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      // Use actual video dimensions, fallback to display dimensions if not available
      const width = video.videoWidth || video.clientWidth || 640;
      const height = video.videoHeight || video.clientHeight || 480;
      
      if (width === 0 || height === 0) {
        toast({ 
          title: "Capture Failed", 
          description: "Video not ready. Please wait a moment and try again.",
          variant: "destructive" 
        });
        return;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setFacePhoto(imageData);
        stopCamera();
        toast({ title: "Face Photo Captured!", description: "Your face photo has been saved." });
      }
    }
  }, [stopCamera, toast]);

  // Handle ID document upload - restricted to image files only
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - images only
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({ 
          title: "Invalid File Type", 
          description: "Please upload an image file (JPG, PNG, GIF, or WebP).", 
          variant: "destructive" 
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Please upload an image under 10MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setIdPhoto(reader.result as string);
        setIdFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const { data: authData, isLoading: authLoading, isSuccess: authSuccess } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
    retry: 2, // Limited retries - login page now verifies session before redirect
    retryDelay: 500,
    staleTime: 30000,
  });

  const { data: ndaStatus, isLoading: ndaLoading } = useQuery({
    queryKey: ["/api/affiliate/nda-status"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/nda-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to check NDA status");
      return res.json();
    },
    enabled: authSuccess && !!authData, // Wait for auth to be confirmed
    staleTime: 30000,
  });

  const signNdaMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/affiliate/sign-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 413) {
          throw new Error("Photos are too large. Please use smaller images or reduce photo quality.");
        }
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        try {
          const error = await res.json();
          throw new Error(error.message || "Failed to sign NDA");
        } catch {
          throw new Error("Failed to sign NDA. Please try again.");
        }
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/nda-status"] });
      queryClient.invalidateQueries({ queryKey: ["affiliate-nda-status"] });
      toast({ title: "NDA Signed Successfully!", description: "Welcome to the team! You can now access the affiliate dashboard." });
      // Redirect to affiliate dashboard - contracts can be signed later
      setLocation("/affiliate/dashboard");
    },
    onError: (error: Error) => {
      // Provide helpful error messages for common issues
      let description = error.message;
      if (error.message.includes("Session expired")) {
        description = "Your session has expired. Please log in again and try signing the NDA.";
      } else if (error.message.includes("too large")) {
        description = "Your photos are too large. Try taking photos with a lower resolution camera setting.";
      }
      toast({ title: "Error Signing NDA", description, variant: "destructive" });
    },
  });

  // Initialize canvas with proper styling and resolution when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const setupCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Save existing signature before resize if user has drawn
      let savedImageData: string | null = null;
      let savedAspectRatio = 1;
      if (hasDrawnSignature && canvas.width > 0 && canvas.height > 0) {
        try {
          savedImageData = canvas.toDataURL("image/png");
          savedAspectRatio = canvas.width / canvas.height;
        } catch (e) {
          console.warn("Could not save signature before resize");
        }
      }
      
      // Get the display size from CSS
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set canvas backing store to match display size * device pixel ratio for crispness
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Reset transform before applying new scale (prevents compounding on multiple calls)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      // Scale context to match the device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set up stroke style for signature
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Restore saved signature if it existed, maintaining aspect ratio
      if (savedImageData && hasDrawnSignature) {
        const img = new Image();
        img.onload = () => {
          // Calculate dimensions to maintain aspect ratio (letterbox/pillarbox)
          const newAspect = rect.width / rect.height;
          let drawWidth = rect.width;
          let drawHeight = rect.height;
          let offsetX = 0;
          let offsetY = 0;
          
          if (savedAspectRatio > newAspect) {
            // Old was wider, fit to width
            drawHeight = rect.width / savedAspectRatio;
            offsetY = (rect.height - drawHeight) / 2;
          } else {
            // Old was taller, fit to height
            drawWidth = rect.height * savedAspectRatio;
            offsetX = (rect.width - drawWidth) / 2;
          }
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };
        img.src = savedImageData;
      }
    };
    
    // Debounced resize handler to prevent rapid fire issues
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(setupCanvas, 150);
    };
    
    setupCanvas();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [hasDrawnSignature]);

  // Get coordinates from mouse or touch event - coordinates in CSS pixels (ctx is already scaled by DPR)
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Return CSS pixel coordinates (context is already scaled by DPR)
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Check if canvas has actual signature content (non-empty pixels) with early exit
  const hasSignatureContent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Count non-transparent pixels with early exit once threshold is met
    let drawnPixels = 0;
    const threshold = 100; // Minimum pixels for valid signature
    
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        drawnPixels++;
        if (drawnPixels >= threshold) return true; // Early exit for performance
      }
    }
    
    return false;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Re-apply stroke settings in case they were lost
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault(); // Prevent scrolling on touch
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Mark that user has drawn something
    if (!hasDrawnSignature) {
      setHasDrawnSignature(true);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
    setStrokeCount(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stop camera if still active to prevent it staying on
    stopCamera();
    
    if (!formData.agreedToTerms) {
      toast({ title: "Please agree to the terms", variant: "destructive" });
      return;
    }
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      toast({ title: "Name Required", description: "Please enter your full legal name.", variant: "destructive" });
      return;
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
      toast({ title: "Address Required", description: "Please enter your mailing address.", variant: "destructive" });
      return;
    }
    
    if (!facePhoto) {
      toast({ title: "Face Photo Required", description: "Please capture your face using the camera.", variant: "destructive" });
      return;
    }
    
    if (!idPhoto) {
      toast({ title: "ID Upload Required", description: "Please upload a photo of your ID document.", variant: "destructive" });
      return;
    }
    
    // Verify signature was actually drawn with sufficient content (require multiple strokes and pixel content)
    if (!hasDrawnSignature || strokeCount < 2 || !hasSignatureContent()) {
      toast({ title: "Signature Required", description: "Please sign your full name in the signature box. A meaningful signature with multiple strokes is required.", variant: "destructive" });
      return;
    }
    
    const canvas = canvasRef.current;
    const signatureData = canvas?.toDataURL("image/png") || null;
    
    if (!signatureData) {
      toast({ title: "Signature Error", description: "Could not capture signature. Please try again.", variant: "destructive" });
      return;
    }
    
    signNdaMutation.mutate({
      ...formData,
      signatureData,
      facePhoto,
      idPhoto,
    });
  };

  // Redirect to login if not authenticated or not an affiliate
  useEffect(() => {
    if (!authLoading && (!authData || authData.user?.role !== "affiliate")) {
      setLocation("/affiliate/login");
    }
  }, [authLoading, authData, setLocation]);

  // Redirect to dashboard if NDA is already signed
  useEffect(() => {
    if (!ndaLoading && ndaStatus?.hasSigned) {
      setLocation("/affiliate/dashboard");
    }
  }, [ndaLoading, ndaStatus, setLocation]);

  if (authLoading || ndaLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!authData || authData.user?.role !== "affiliate") {
    return null;
  }

  if (ndaStatus?.hasSigned) {
    return null;
  }

  const today = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/90 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-brand-navy p-6 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Affiliate Confidentiality Agreement</h1>
            <p className="text-white/80">Navigator USA Corp - Veterans' Family Resources</p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-800">Important Notice</h3>
                  <p className="text-sm text-blue-700">
                    Before accessing the affiliate portal, you must agree to this good-faith confidentiality agreement.
                    This protects our veteran community and ensures the integrity of our programs.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-8 text-gray-700 border rounded-lg p-6 bg-gray-50">
              <h2 className="text-lg font-bold text-brand-navy text-center">NON-CIRCUMVENTION, NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</h2>
              
              <p className="text-sm text-center">
                <strong>Effective Date:</strong> {today}
              </p>
              
              <p>
                This Non-Circumvention, Non-Disclosure and Confidentiality Agreement ("Agreement") is entered into between 
                <strong> Navigator USA Corp</strong>, a 501(c)(3) non-profit organization, located at 
                429 D Shoreline Village Dr, Long Beach, CA 90802 ("Organization"), and the undersigned party ("Signatory"), 
                collectively referred to as the "Parties."
              </p>

              <h3 className="text-md font-bold mt-4">1. DEFINITIONS</h3>
              <p className="text-sm">
                <strong>"Affiliates"</strong> means any entity or person controlled by, under common control with, or controlling 
                a Party, including but not limited to: subsidiaries, parent companies, stockholders, partners, co-ventures, 
                trading partners, joint ventures, divisions, and other associated organizations.
              </p>
              <p className="text-sm">
                <strong>"Representatives"</strong> means any and all directors, officers, employees, agents, consultants, 
                contractors, attorneys, accountants, advisors, assigns, designees, heirs, successors, family members, 
                or representatives of a Party or its Affiliates.
              </p>
              <p className="text-sm">
                <strong>"Confidential Information"</strong> includes but is not limited to: names, identities, addresses, 
                telephone numbers, email addresses, bank codes, account numbers, financial references, trade secrets, 
                proprietary formulas, business methods, processes, customer lists, supplier lists, pricing information, 
                commission structures, referral tracking systems, safety protocols, and any information regarding contacts, 
                sources, intermediaries, or potential acquisitions disclosed orally, in writing, electronically, visually, 
                or by demonstration.
              </p>

              <h3 className="text-md font-bold">2. PURPOSE & MISSION</h3>
              <p>
                Navigator USA Corp is a tax-exempt public charity dedicated to supporting veteran families through 
                education, healthcare assistance, and financial empowerment programs. The affiliate ecosystem exists 
                to help veterans earn income while contributing to this mission.
              </p>

              <h3 className="text-md font-bold">3. NON-DISCLOSURE & CONFIDENTIALITY</h3>
              <p>
                The Signatory agrees, both directly and indirectly, for themselves and on behalf of all Affiliates 
                and Representatives, to the following:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Maintain complete confidentiality regarding all Confidential Information</li>
                <li>Not disclose, reveal, or make use of any Confidential Information without specific written permission</li>
                <li>Cause all Affiliates and Representatives to sign confidentiality agreements at least as protective as this Agreement</li>
                <li>Ensure that all Affiliates, Representatives, employees, officers, directors, agents, consultants, and advisors who are given access to Confidential Information shall be bound by and comply with the terms of this Agreement</li>
                <li><strong>RECEIVING PARTY LIABILITY:</strong> The Signatory shall be fully liable for any breach of this Agreement by their Affiliates, Representatives, employees, agents, or any third parties to whom Confidential Information has been disclosed by such persons or entities</li>
              </ul>

              <h3 className="text-md font-bold text-brand-red bg-red-50 p-2 rounded">4. NON-CIRCUMVENTION (STRICTLY ENFORCED)</h3>
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 my-3">
                <p className="font-bold text-brand-red text-center mb-3">
                  ⚠️ CRITICAL: THE NON-CIRCUMVENTION PROVISIONS BELOW ARE THE MOST IMPORTANT TERMS OF THIS AGREEMENT ⚠️
                </p>
                <p className="font-semibold text-brand-red">
                  The Signatory agrees, both DIRECTLY and INDIRECTLY, ABSOLUTELY and WITHOUT EXCEPTION, not to circumvent, 
                  avoid, bypass, interfere with, or undermine the Organization, its Affiliates, or Representatives in ANY manner:
                </p>
              </div>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>ABSOLUTE PROHIBITION:</strong> The Signatory is STRICTLY PROHIBITED from circumventing this Agreement under ANY circumstances. There are NO exceptions, NO excuses, and NO justifications for circumvention. Any attempt to rationalize, minimize, or explain away circumvention will be treated as willful and intentional breach</li>
                <li><strong>Scope of Prohibition:</strong> This prohibition applies whether such circumvention is conducted (a) directly by the Signatory, (b) indirectly through Affiliates, Representatives, or third parties, (c) through any corporate restructuring, subsidiary formation, or related entity, (d) through family members, friends, associates, or any other proxies, (e) through trusts, LLCs, shell companies, or any legal structures, (f) through verbal or "handshake" agreements designed to avoid written records, or (g) through any scheme, artifice, or device whatsoever</li>
                <li><strong>Protected Relationships - PERPETUAL:</strong> The Signatory shall NEVER, at ANY time during or after this Agreement, contact, solicit, accept, or conduct any business with any clients, prospects, vendors, investors, banks, funding sources, suppliers, customers, or business opportunities introduced by or discovered through the Organization without express written permission. This protection is PERPETUAL and survives termination of this Agreement</li>
                <li><strong>No Bypass Attempts - ZERO TOLERANCE:</strong> The Signatory shall not attempt to bypass, circumvent, avoid, disable, manipulate, or interfere with the Organization's referral tracking, attribution systems, IP tracking, cookie-based tracking, or commission structures by ANY means whatsoever. ANY such attempt, successful or not, constitutes a material breach</li>
                <li><strong>No Competitive Interference:</strong> The Signatory shall not introduce clients, prospects, or contacts to competing organizations, services, or individuals that would reduce, divert, or eliminate commissions, fees, or benefits owed to any party in the affiliate network</li>
                <li><strong>Protection of Introductions - IN PERPETUITY:</strong> ALL relationships, introductions, contacts, and business opportunities developed through the Organization belong to the Organization and its affiliate network IN PERPETUITY. This includes contacts made through the Signatory's referral link, at events, through marketing materials, or by any other means connected to the Organization</li>
                <li><strong>No Solicitation - LIFETIME BAN:</strong> The Signatory shall NEVER solicit, recruit, encourage, or induce any affiliate, employee, contractor, representative, client, or prospect of the Organization to terminate their relationship or to join any competing organization. Violation results in LIFETIME ban and maximum penalties</li>
                <li><strong>No Side Deals:</strong> The Signatory shall not enter into any "side deals," "special arrangements," "off-the-books" agreements, or any other arrangements that would deprive any party in the affiliate network of their rightful commissions or benefits</li>
                <li><strong>Monitoring Consent:</strong> The Signatory expressly consents to the Organization's use of tracking technologies, audits, and investigations to ensure compliance with these non-circumvention provisions</li>
              </ul>
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 mt-3">
                <p className="font-bold text-yellow-800 text-sm text-center">
                  WARNING: Circumvention is treated MORE SERIOUSLY than any other breach. Penalties for circumvention are 
                  FIVE TIMES (5X) the standard penalty amount, plus all remedies described in Section 8.
                </p>
              </div>

              <h3 className="text-md font-bold">5. BINDING EFFECT ON ALL PARTIES</h3>
              <p className="font-semibold bg-yellow-50 p-3 rounded border border-yellow-200">
                This Agreement shall be binding upon all Parties and their heirs, successors, associates, Affiliates, 
                Representatives, assigns, employees, agents, consultants, contractors, family members, friends, 
                business partners, and any individual, firm, company, corporation, joint venture, partnership, 
                division, subsidiary, or other entity of which the Signatory is an agent, officer, heir, successor, 
                assign, designee, or beneficial owner. The Signatory represents that they have full authority to 
                bind all such persons and entities to the terms of this Agreement.
              </p>

              <h3 className="text-md font-bold">6. GOOD FAITH & FAIR DEALING</h3>
              <p>
                The Signatory agrees to operate in good faith, understanding that this ecosystem is designed to:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Help veterans generate income for themselves and their families</li>
                <li>Support Navigator USA Corp's mission of veteran education and healthcare</li>
                <li>Create sustainable opportunities for the veteran community</li>
                <li>Maintain fair commission distribution among all network participants</li>
              </ul>

              <h3 className="text-md font-bold">7. SAFETY, SECURITY AND CIRCUMVENTION PROTOCOLS</h3>
              <p>
                The Signatory acknowledges that the Organization employs comprehensive safety, security, and circumvention 
                protocols including but not limited to IP tracking, cookie-based attribution, referral link monitoring, 
                and 30-day first-touch attribution. These protocols are confidential and proprietary. The Signatory 
                agrees not to share, disclose, discuss, or attempt to circumvent these systems.
              </p>

              <h3 className="text-md font-bold text-brand-red bg-red-50 p-2 rounded">8. PENALTIES FOR BREACH (SEVERELY ENFORCED)</h3>
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 my-3">
                <p className="font-bold text-brand-red">
                  In the event of circumvention or breach of this Agreement by the Signatory, directly or indirectly, 
                  or by their Affiliates, Representatives, agents, or any third parties acting on their behalf:
                </p>
              </div>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>CIRCUMVENTION PENALTY (5X):</strong> For violations of Section 4 (Non-Circumvention), the breaching party shall pay a monetary penalty equal to <span className="font-bold text-brand-red">FIVE (5) TIMES</span> the commission, fee, or maximum financial benefit the non-breaching party should have realized, with a MINIMUM penalty of $50,000 per incident</li>
                <li><strong>General Breach Penalty (3X):</strong> For all other breaches, the breaching party shall pay a legal monetary penalty equal to THREE (3) TIMES the commission, fee, or maximum financial benefit the non-breaching party should have realized from such transaction</li>
                <li><strong>Additional Damages:</strong> PLUS all expenses incurred including legal costs, attorney fees, court costs, investigation costs, expert witness fees, and lost profits and business opportunities</li>
                <li><strong>Injunctive Relief - NO BOND REQUIRED:</strong> The Organization shall be entitled to seek IMMEDIATE injunctive relief and equitable remedies WITHOUT POSTING BOND to restrain the breaching party, their Affiliates, Representatives, and agents from continuing the breach</li>
                <li><strong>IMMEDIATE FORFEITURE:</strong> Violators shall be IMMEDIATELY and PERMANENTLY removed from the affiliate network with TOTAL forfeiture of ALL pending, approved, and future commissions, with no right of appeal</li>
                <li><strong>Criminal Referral:</strong> The Organization reserves the right to refer matters involving theft of trade secrets, wire fraud, or intentional interference to appropriate federal and state law enforcement authorities for criminal prosecution</li>
                <li><strong>Public Disclosure:</strong> The Organization reserves the right to disclose the identity of violators to other organizations, affiliates, and the business community as a protective measure</li>
                <li><strong>Joint and Several Liability:</strong> The Signatory shall be jointly and severally liable with any Affiliates, Representatives, or third parties who participated in or benefited from the breach</li>
              </ul>

              <h3 className="text-md font-bold">9. ETHICS & PROFESSIONAL CONDUCT</h3>
              <p>
                The Signatory agrees, both directly and indirectly, for themselves and on behalf of all Affiliates 
                and Representatives, to maintain the highest ethical standards in all dealings:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Integrity:</strong> Act with honesty, transparency, and integrity in all business activities connected with Navigator USA Corp</li>
                <li><strong>Anti-Corruption:</strong> Not offer, solicit, accept, or pay any bribe, kickback, facilitation payment, or other improper payment directly or indirectly in connection with this Agreement or any Organization business</li>
                <li><strong>Conflicts of Interest:</strong> Disclose any real or apparent conflicts of interest that may compromise professional judgment or the interests of the Organization</li>
                <li><strong>Gifts & Benefits:</strong> Not offer, solicit, or accept any substantial gifts, extravagant entertainment, or payments that could create an appearance of impropriety</li>
                <li><strong>Compliance:</strong> Comply with all applicable federal, state, and local laws, regulations, and industry standards</li>
                <li><strong>Professional Representation:</strong> Represent the Organization professionally and accurately, never making false, misleading, or exaggerated claims about services, benefits, or compensation</li>
                <li><strong>Veteran Community:</strong> Honor the mission of serving veteran families with respect, dignity, and genuine care for their wellbeing</li>
              </ul>

              <h3 className="text-md font-bold">10. ANTI-DEFAMATION & NON-DISPARAGEMENT</h3>
              <p className="font-semibold text-brand-red">
                The Signatory agrees, both DIRECTLY and INDIRECTLY, to refrain from any disparagement, defamation, 
                libel, or slander of the Organization:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Prohibited Conduct:</strong> The Signatory shall not make, publish, or communicate to any person, entity, or public forum any defamatory, disparaging, negative, or harmful remarks, comments, or statements concerning Navigator USA Corp, its businesses, programs, services, officers, directors, employees, affiliates, volunteers, or any associated third parties</li>
                <li><strong>Scope:</strong> This prohibition applies to all forms of communication including but not limited to: oral statements, written documents, social media posts, online reviews, blog posts, forum comments, video content, podcasts, interviews, and any electronic or digital communications</li>
                <li><strong>Third Party Communications:</strong> The Signatory shall not encourage, induce, or assist any third party (including family members, friends, associates, or Affiliates) to make disparaging statements about the Organization</li>
                <li><strong>Mutual Obligation:</strong> The Organization agrees to instruct its officers and directors to refrain from making disparaging statements about the Signatory that are harmful to their business or personal reputation</li>
                <li><strong>Legal Exemptions:</strong> This provision does not restrict either party from: (a) making truthful statements required by applicable law, regulation, or legal process; (b) communicating with government agencies; (c) exercising protected rights under whistleblower provisions; or (d) enforcing this Agreement</li>
                <li><strong>Immediate Remedies:</strong> Any breach of this anti-defamation provision shall entitle the Organization to seek immediate injunctive relief without posting bond, plus actual damages, reputational damages, and reasonable attorney fees</li>
              </ul>

              <h3 className="text-md font-bold">11. TERM & SURVIVAL</h3>
              <p>
                This Agreement shall remain in full force and effect for a period of TEN (10) YEARS from the date of 
                execution, or until terminated by mutual written consent. The non-disclosure, non-circumvention, ethics, 
                anti-defamation, and confidentiality obligations shall survive termination of this Agreement and continue 
                in PERPETUITY for trade secrets and proprietary information, and for ten (10) years for other Confidential Information.
              </p>

              <h3 className="text-md font-bold">12. PRE-EXISTING RELATIONSHIPS</h3>
              <p>
                Any third parties that already have a documented pre-existing working relationship with the Signatory, 
                established PRIOR to this Agreement and verifiable through written records dated before the execution 
                of this Agreement, are not subject to the non-circumvention restrictions. The burden of proof for 
                pre-existing relationships rests solely with the Signatory.
              </p>

              <h3 className="text-md font-bold">13. GOVERNING LAW & JURISDICTION</h3>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, 
                without regard to its conflicts of laws principles. The Parties expressly consent to the exclusive 
                jurisdiction of the courts of the State of Delaware, including the Delaware Court of Chancery, in 
                connection with any action to enforce the provisions of this Agreement or arising under or by reason 
                of this Agreement. Each Party waives any objection to venue in such courts and any claim that such 
                courts are an inconvenient forum.
              </p>
              <p className="text-sm mt-2">
                <strong>Delaware State Law References:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>6 Del. C. § 18-305:</strong> Access to and confidentiality of information; records (Delaware Limited Liability Company Act)</li>
                <li><strong>6 Del. C. § 17-305:</strong> Access to and confidentiality of information (Delaware Revised Uniform Limited Partnership Act)</li>
                <li><strong>Delaware Uniform Trade Secrets Act (6 Del. C. § 2001 et seq.):</strong> Protection of trade secrets, confidential business information, and proprietary formulas</li>
                <li><strong>Delaware Chancery Court Rules:</strong> Expedited proceedings and equitable remedies for breach of confidentiality agreements</li>
              </ul>
              <p className="text-sm mt-2">
                The Parties acknowledge that Delaware law provides strong protection for confidential business information, 
                trade secrets, and contractual non-circumvention provisions, and that the Delaware Court of Chancery 
                possesses specialized expertise in commercial and business disputes. In the event of dispute, the 
                prevailing Party shall be entitled to recover all reasonable attorney fees and costs.
              </p>

              <h3 className="text-md font-bold">14. ELECTRONIC SIGNATURES</h3>
              <p>
                Signatures on this Agreement received by way of electronic signature shall be deemed valid, enforceable, 
                and admissible for all purposes as original signatures pursuant to the Electronic Signatures in Global 
                and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).
              </p>

              <h3 className="text-md font-bold">15. ENTIRE AGREEMENT</h3>
              <p>
                This Agreement constitutes the entire understanding between the Parties and supersedes all prior 
                negotiations, agreements, or understandings, whether oral or written. Any waiver, amendment, or 
                modification must be in writing and signed by all Parties to be effective.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Legal Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full legal name"
                    data-testid="input-nda-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veteranNumber">Veteran ID Number (Optional)</Label>
                  <Input
                    id="veteranNumber"
                    value={formData.veteranNumber}
                    onChange={(e) => setFormData({ ...formData, veteranNumber: e.target.value })}
                    placeholder="VA File Number or DD-214 Number"
                    data-testid="input-nda-veteran-number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Mailing Address *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, State, ZIP"
                  data-testid="input-nda-address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customReferralCode">Custom Referral Code (Optional)</Label>
                <p className="text-sm text-gray-500">Choose a memorable code for your referral links (e.g., JOHNSMITH, VETERAN123)</p>
                <Input
                  id="customReferralCode"
                  value={formData.customReferralCode}
                  onChange={(e) => setFormData({ ...formData, customReferralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                  placeholder="YOURCODE"
                  maxLength={20}
                  data-testid="input-nda-referral-code"
                />
              </div>

              {/* Face Photo Capture Section */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <Label className="text-blue-800 font-bold">Face Photo Verification *</Label>
                </div>
                <p className="text-sm text-blue-700">
                  For identity verification, please capture a clear photo of your face using your camera.
                </p>
                
                {!facePhoto ? (
                  <div className="space-y-3">
                    {/* Always render video element so ref is available when stream attaches */}
                    <div 
                      className="space-y-3"
                      style={{ 
                        visibility: isCameraActive ? 'visible' : 'hidden',
                        height: isCameraActive ? 'auto' : '0',
                        overflow: 'hidden'
                      }}
                    >
                      <div className="relative rounded-lg overflow-hidden border-2 border-blue-400 bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full max-w-md mx-auto"
                          style={{ minHeight: '240px' }}
                          data-testid="video-webcam"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={captureFacePhoto}
                          className="bg-green-600 hover:bg-green-700"
                          data-testid="button-capture-face"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Capture Photo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={stopCamera}
                          data-testid="button-stop-camera"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    {!isCameraActive && (
                      <Button
                        type="button"
                        onClick={startCamera}
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid="button-start-camera"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={facePhoto}
                        alt="Face photo"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-green-500"
                        data-testid="img-face-photo"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFacePhoto(null)}
                      data-testid="button-retake-face"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake Photo
                    </Button>
                  </div>
                )}
              </div>

              {/* ID Upload Section */}
              <div className="space-y-3 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-600" />
                  <Label className="text-amber-800 font-bold">ID Document Upload *</Label>
                </div>
                <p className="text-sm text-amber-700">
                  Upload a clear photo of your government-issued ID (driver's license, passport, military ID, etc.)
                </p>
                
                {!idPhoto ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdUpload}
                      className="hidden"
                      id="id-upload"
                      data-testid="input-id-upload"
                    />
                    <label
                      htmlFor="id-upload"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Choose ID Photo
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={idPhoto}
                        alt="ID document"
                        className="max-w-xs max-h-48 object-contain rounded-lg border-2 border-green-500"
                        data-testid="img-id-photo"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-green-700 font-medium">{idFileName}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setIdPhoto(null); setIdFileName(""); }}
                      data-testid="button-remove-id"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove & Upload Different ID
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Electronic Signature</Label>
                <p className="text-sm text-gray-500">Sign with your mouse or finger below</p>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden touch-none">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={150}
                    className="w-full bg-white cursor-crosshair touch-none"
                    style={{ touchAction: 'none' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                    data-testid="canvas-signature"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                  Clear Signature
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: !!checked })}
                  data-testid="checkbox-agree-terms"
                />
                <Label htmlFor="agreedToTerms" className="text-sm cursor-pointer">
                  I have read and agree to the terms of this Non-Circumvention, Non-Disclosure and Confidentiality Agreement. 
                  I understand and acknowledge that this Agreement is binding upon myself, my affiliates, representatives, 
                  agents, employees, family members, and all associated parties both directly and indirectly. I understand 
                  that Navigator USA Corp is a 501(c)(3) non-profit organization and that violations may result in penalties 
                  of THREE (3) TIMES the damages plus attorney fees.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!formData.agreedToTerms || signNdaMutation.isPending}
                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white py-6 text-lg font-bold"
                data-testid="button-sign-nda"
              >
                <FileSignature className="w-5 h-5 mr-2" />
                {signNdaMutation.isPending ? "Signing..." : "Sign Agreement & Continue"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Navigator USA Corp | 501(c)(3) Public Charity<br />
                429 D Shoreline Village Dr, Long Beach, CA 90802<br />
                Effective Date: July 15, 2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
