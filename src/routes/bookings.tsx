import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarX2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyAppointments, updateAppointmentStatus } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings | EliteBook Pro" },
      { name: "description", content: "View, track and cancel your upcoming service appointments." },
      { property: "og:title", content: "My bookings | EliteBook Pro" },
      { property: "og:description", content: "Track and manage every appointment you booked." },
    ],
  }),
  component: BookingsPage,
});

const statusVariant = (status: string) =>
  status === "Cancelled" ? "destructive" : status === "Completed" ? "secondary" : "default";

function BookingsPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  const { data: bookings = [], isPending } = useQuery({
    queryKey: ["my-appointments", user?.id],
    queryFn: () => fetchMyAppointments(user!.id),
    enabled: Boolean(user),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => updateAppointmentStatus(id, "Cancelled"),
    onSuccess: () => {
      toast.success("Booking cancelled");
      qc.invalidateQueries({ queryKey: ["my-appointments"] });
      qc.invalidateQueries({ queryKey: ["booked-slots"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sign in to see your bookings</h1>
        <Button asChild className="mt-6">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">My bookings</h1>
      <p className="mt-1 text-muted-foreground">All your appointments in one place.</p>

      {isPending ? (
        <p className="mt-10 text-muted-foreground">Loading…</p>
      ) : bookings.length === 0 ? (
        <Card className="mt-8 card-soft">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <CalendarX2 className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">No appointments yet.</p>
            <Button asChild>
              <Link to="/">Browse services</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="card-soft">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{b.service_name}</span>
                    <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.category} · {b.appointment_date} at {b.time_slot}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">₹{b.price}</span>
                  {b.status === "Confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={cancel.isPending}
                      onClick={() => cancel.mutate(b.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}