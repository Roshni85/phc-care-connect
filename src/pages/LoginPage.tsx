import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Phone, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('Please enter both phone number and password');
      return;
    }

    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const result = await login({ phone, password });

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-8 animate-slide-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-elevated mb-4">
          <Heart className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">PHC Staff Portal</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone Number / Staff ID
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-10 h-12 bg-card border-border"
                maxLength={10}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-card border-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 font-medium"
              onClick={() => toast.info('Please contact your administrator to reset password')}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
          <p className="text-xs font-medium text-muted-foreground mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">LHV:</span> 9876543210 / 1234</p>
            <p><span className="font-medium text-foreground">Pharmacist:</span> 9876543211 / 1234</p>
            <p><span className="font-medium text-foreground">Admin:</span> 9876543212 / 1234</p>
            <p><span className="font-medium text-foreground">ANM:</span> 9876543213 / 1234</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          National Health Mission • Government of India
        </p>
      </div>
    </div>
  );
}
