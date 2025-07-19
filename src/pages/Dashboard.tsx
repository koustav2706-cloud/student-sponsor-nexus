import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import SponsorDashboard from '@/components/dashboards/SponsorDashboard';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {userRole === 'student' && <StudentDashboard />}
        {userRole === 'sponsor' && <SponsorDashboard />}
        {!userRole && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Setting up your account...</h2>
              <p className="text-muted-foreground">Please wait while we configure your dashboard.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;