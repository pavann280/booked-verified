import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function AppNav() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <CalendarCheck className="size-6 text-primary" />
          EliteBook Pro
        </Link>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Browse</Link>
          </Button>
          {user && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/bookings">My bookings</Link>
            </Button>
          )}
          {isAdmin && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {user ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {profile?.full_name || user.email}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}