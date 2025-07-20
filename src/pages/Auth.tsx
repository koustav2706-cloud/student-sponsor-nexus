import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Building2, AlertCircle } from 'lucide-react';

type UserRole = 'student' | 'sponsor';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as UserRole;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!role) {
      setError('Please select your role');
      setIsLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, fullName, role);

    if (signUpError) {
      setError(signUpError.message);
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 flex items-center justify-center py-20">
        <Card className="w-full max-w-lg p-10 shadow-floating neumorphic border-2 border-border/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-4 text-overlay">
              Welcome to SponsorSync
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect students and sponsors through smart matchmaking
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="signin-email" className="text-base font-medium">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password" className="text-base font-medium">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label htmlFor="signup-name" className="text-base font-medium">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-base font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-base font-medium">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirm" className="text-base font-medium">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-12 text-base mt-2"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold">I am a:</Label>
                  <RadioGroup name="role" className="mt-2">
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-accent/20 hover:border-primary/30 transition-all duration-300">
                      <RadioGroupItem value="student" id="student" />
                      <User className="h-5 w-5 text-primary" />
                      <label htmlFor="student" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Student Organizer</div>
                        <div className="text-base text-muted-foreground">
                          Looking for sponsors for events
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-accent/20 hover:border-primary/30 transition-all duration-300">
                      <RadioGroupItem value="sponsor" id="sponsor" />
                      <Building2 className="h-5 w-5 text-primary" />
                      <label htmlFor="sponsor" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Sponsor</div>
                        <div className="text-base text-muted-foreground">
                          Looking to sponsor student events
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Auth;