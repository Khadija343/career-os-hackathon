import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

function ForgotPassword() {
  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <PageTitle title="Reset your password" />
        <p className="text-sm text-slate-400">We’ll help you get back into your account securely.</p>
      </div>

      <div className="space-y-4">
        <Input type="email" placeholder="Enter your email" />
        <Button text="Send Reset Link" className="w-full" />
      </div>

      <Link to="/login" className="text-sm text-slate-400 hover:text-white">
        Back to Login
      </Link>
    </Card>
  );
}

export default ForgotPassword;