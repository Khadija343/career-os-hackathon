import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PageTitle from "../../components/common/PageTitle";

function ResetPassword() {
  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <PageTitle title="Choose a new password" />
        <p className="text-sm text-slate-400">Create a strong password and confirm it below.</p>
      </div>

      <div className="space-y-4">
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm Password" />
        <Button text="Reset Password" className="w-full" />
      </div>

      <Link to="/login" className="text-sm text-slate-400 hover:text-white">
        Back to Login
      </Link>
    </Card>
  );
}

export default ResetPassword;