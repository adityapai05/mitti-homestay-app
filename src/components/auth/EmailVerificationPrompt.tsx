import { MailCheck } from "lucide-react";

const EmailVerificationPrompt = ({
  email,
  onBackToLogin,
}: {
  email: string;
  onBackToLogin: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-6 text-mitti-dark-brown">
      <MailCheck className="w-12 h-12 text-mitti-olive" />

      <h2 className="text-xl font-semibold">Verify Your Email</h2>

      <p className="text-sm">
        We have sent a verification link to <strong>{email}</strong>.
        <br />
        Please check your inbox <strong>and spam folder</strong>.
        <br />
        Once verified, you can return here and log in.
      </p>

      <button
        onClick={onBackToLogin}
        className="mt-2 text-xs text-mitti-dark-brown underline hover:text-mitti-brown"
      >
        Back to Login
      </button>
    </div>
  );
};

export default EmailVerificationPrompt;
