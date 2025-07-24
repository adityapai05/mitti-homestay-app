"use client";

import { useEffect, useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { MdOutlineVerified } from "react-icons/md";
import { sendOtp, confirmOtp } from "@/lib/firebase/authActions";
import { Input } from "@/components/ui/prebuilt-components/input";
import { Button } from "@/components/ui/prebuilt-components/button";
import { toast } from "sonner";
import { useAuthModal } from "@/hooks/useAuthModal";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/prebuilt-components/input-otp";

interface Props {
  onBack: () => void;
}

const PhoneAuthForm = ({ onBack }: Props) => {
  const { closeModal } = useAuthModal();
  const [step, setStep] = useState<"phone" | "otp" | "name" | "done">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const confirmation = await sendOtp(phone);
      setConfirmationResult(confirmation);
      setStep("otp");
      setResendTimer(30);
      toast.success("OTP sent successfully");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await confirmOtp(otp, confirmationResult);
      if (user.displayName) {
        setStep("done");
        closeModal();
      } else {
        setStep("name");
      }
    } catch (err: any) {
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    setError("");
    setLoading(true);
    try {
      const { updateProfile } = await import("firebase/auth");
      await updateProfile(
        (await import("firebase/auth")).getAuth().currentUser!,
        { displayName: name }
      );
      setStep("done");
      toast.success("Name saved");
    } catch (err: any) {
      setError("Failed to save name.");
      toast.error("Failed to save name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-mitti-dark-brown">
        <button onClick={onBack} className="cursor-pointer">
          <BsArrowLeft className="text-xl hover:text-mitti-dark-brown/80" />
        </button>
        <span className="font-semibold text-lg">
          {step === "phone"
            ? "Login with Phone"
            : step === "otp"
            ? "Enter OTP"
            : step === "name"
            ? "Enter Your Name"
            : "Welcome!"}
        </span>
      </div>

      {step === "phone" && (
        <>
          <label className="text-sm font-medium text-mitti-dark-brown">
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-mitti-khaki/50"
          />
          <div ref={recaptchaRef} id="recaptcha-container" className="mt-2" />
          <Button
            onClick={handleSendOtp}
            disabled={loading || !phone}
            className="w-full bg-mitti-dark-brown text-mitti-beige hover:bg-mitti-brown transition cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </>
      )}

      {step === "otp" && (
        <>
          <label className="text-sm font-medium text-mitti-dark-brown">
            Enter 6-digit OTP
          </label>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => setOtp(val)}
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full bg-mitti-dark-brown text-mitti-beige hover:bg-mitti-brown transition cursor-pointer mt-4"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {resendTimer > 0 ? (
            <p className="text-center text-sm text-gray-600">
              Resend OTP in {resendTimer} seconds
            </p>
          ) : (
            <button
              onClick={handleSendOtp}
              className="text-sm text-mitti-dark-brown hover:underline cursor-pointer mx-auto block"
            >
              Resend OTP
            </button>
          )}
        </>
      )}

      {step === "name" && (
        <>
          <label className="text-sm font-medium text-mitti-dark-brown">
            Your Name
          </label>
          <Input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-mitti-khaki/50"
          />
          <Button
            onClick={handleSaveName}
            disabled={loading || name.length < 3}
            className="w-full bg-mitti-dark-brown text-mitti-beige hover:bg-mitti-brown transition cursor-pointer"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </>
      )}

      {error && (
        <p className="text-sm text-red-600 font-medium text-center">{error}</p>
      )}
    </div>
  );
};

export default PhoneAuthForm;
