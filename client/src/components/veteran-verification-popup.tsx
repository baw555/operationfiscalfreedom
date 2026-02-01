import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Star, Heart, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface VeteranVerificationPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

export function VeteranVerificationPopup({ isOpen, onConfirm, onDeny }: VeteranVerificationPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-gradient-to-br from-blue-900 to-blue-950 border-2 border-blue-500 text-white max-w-md" data-testid="veteran-verification-popup">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white text-center">
            Veteran Family Verification
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center mt-4">
            This software is <span className="text-blue-300 font-semibold">exclusively available</span> to veterans and their family members as part of our commitment to serving those who served.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-200">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <span>Active duty military personnel</span>
          </div>
          <div className="flex items-center gap-3 text-gray-200">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <span>Veterans of all branches</span>
          </div>
          <div className="flex items-center gap-3 text-gray-200">
            <Heart className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>Spouses and family members of veterans</span>
          </div>
        </div>

        <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-600">
          <p className="text-sm text-blue-200 text-center">
            By continuing, you confirm that you are a veteran or a family member of a veteran.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onDeny}
            className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white"
            data-testid="button-deny-veteran"
          >
            I am not eligible
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
            data-testid="button-confirm-veteran"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Yes, I'm eligible
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useVeteranVerification() {
  const [showPopup, setShowPopup] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const verified = sessionStorage.getItem("veteran_verified") === "true";
    setIsVerified(verified);
  }, []);

  const checkVerification = () => {
    const verified = sessionStorage.getItem("veteran_verified") === "true";
    if (!verified) {
      setShowPopup(true);
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    sessionStorage.setItem("veteran_verified", "true");
    setIsVerified(true);
    setShowPopup(false);
  };

  const handleDeny = () => {
    setShowPopup(false);
    setLocation("/");
  };

  return {
    showPopup,
    isVerified,
    checkVerification,
    handleConfirm,
    handleDeny,
    VeteranPopup: () => (
      <VeteranVerificationPopup
        isOpen={showPopup}
        onConfirm={handleConfirm}
        onDeny={handleDeny}
      />
    ),
  };
}
