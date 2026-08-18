import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchAllAppointments,
  fetchCatalog,
  fetchProfilesById,
  todayISO,
  updateAppointmentStatus,
  type Appointment,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard | EliteBook Pro" },
      { name: "description", content: "Business analytics and appointment management for EliteBook Pro staff." },
      { property: "og:title", content: "Admin dashboard | EliteBook Pro" },
      { property: "og:description", content: "Track revenue, bookings and provider performance." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data: appointments = [] } = useQuery({
    queryKey: ["all-appointments"],
    queryFn: fetchAllAppointments,
    enabled: isAdmin,
  });
  const { data: catalog } = useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog, enabled: isAdmin });
  const { data: names = {} } = useQuery({
    queryKey: ["profile-names", appointments.length],
    queryFn: () => fetchProfilesById([...new Set(appointments.map((a) => a.user_id))]),
    enabled: isAdmin && appointments.length > 0,
  });

  const setStatusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Appointment["status"] }) =>
      updateAppointmentStatus(id, next),
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["all-appointments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = useMemo(() => {
    const active = appointments.filter((a) => a.status !== "Cancelled");
    return {
      total: appointments.length,
      today: appointments.filter((a) => a.appointment_date === todayISO()).length,
      customers: new Set(appointments.map((a) => a.user_id)).size,
      revenue: active.reduce((sum, a) => sum + a.price, 0),
      completed: appointments.filter((a) => a.status === "Completed").length,
      providers: catalog?.providers.length ?? 0,
    };
  }, [appointments, catalog]);

  const rows = appointments.filter((a) => {
    if (status && a.status !== status) return false;
    if (search) {
      const hay = `${names[a.user_id] ?? ""} ${a.service_name} ${a.category}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  if (loading) return <p className="py-24 text-center text-muted-foreground">Loading…</p>;

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">
          This dashboard is restricted to accounts with the admin role.
        </p>
        <Button asChild className="mt-6">
          <Link to={user ? "/" : "/auth"}>{user ? "Back home" : "Sign in"}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="admin-surface">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 opacity-90">Real-time analytics and booking management</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Total bookings", stats.total],
            ["Today", stats.today],
            ["Customers", stats.customers],
            ["Revenue", `₹${stats.revenue}`],
            ["Completed", stats.completed],
            ["Providers", stats.providers],
          ].map(([label, value]) => (
            <Card key={label as string} className="card-soft">
              <CardContent className="py-5 text-center">
                <div className="text-2xl font-extrabold text-primary">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Input
            className="max-w-xs"
            placeholder="Search customer or service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-md border border-input bg-card px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <Card className="mt-4 card-soft">
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{names[a.user_id] ?? "—"}</TableCell>
                      <TableCell>{a.service_name}</TableCell>
                      <TableCell>{a.appointment_date}</TableCell>
                      <TableCell>{a.time_slot}</TableCell>
                      <TableCell>₹{a.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === "Cancelled"
                              ? "destructive"
                              : a.status === "Completed"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2 whitespace-nowrap">
                        {a.status === "Confirmed" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setStatusMutation.mutate({ id: a.id, next: "Completed" })}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setStatusMutation.mutate({ id: a.id, next: "Cancelled" })}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}