import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Search, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  CATEGORIES,
  createBooking,
  fetchBookedSlots,
  fetchCatalog,
  todayISO,
  type Provider,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EliteBook Pro | Book trusted local services" },
      {
        name: "description",
        content:
          "Browse healthcare, salon, car wash, mechanic and home service providers and book a real-time slot in seconds.",
      },
      { property: "og:title", content: "EliteBook Pro | Book trusted local services" },
      {
        property: "og:description",
        content: "Real-time availability, instant confirmation, no double bookings.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [active, setActive] = useState<Provider | null>(null);

  const { data, isPending } = useQuery({ queryKey: ["catalog"], queryFn: fetchCatalog });
  const providers = data?.providers ?? [];
  const services = data?.services ?? [];

  const filtered = useMemo(() => {
    const max = Number.parseInt(maxPrice, 10);
    return providers.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (!Number.isNaN(max) && p.price > max) return false;
      return true;
    });
  }, [providers, category, search, location, maxPrice]);

  const serviceName = (p: Provider) =>
    services.find((s) => s.id === p.service_id)?.name ?? p.category;

  return (
    <div>
      <section className="hero-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Book your service</h1>
          <p className="mx-auto mt-3 max-w-xl text-base opacity-90">
            Real-time availability · Verified providers · Instant confirmation
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search providers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Input
            type="number"
            placeholder="Max price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setLocation("");
              setMaxPrice("");
              setCategory("All");
            }}
          >
            Reset filters
          </Button>
        </div>

        {isPending ? (
          <p className="py-16 text-center text-muted-foreground">Loading providers…</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No providers match your filters.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Card key={p.id} className="card-soft transition-transform hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold">{p.name}</h2>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="size-4 fill-accent text-accent" />
                      {p.rating} ({p.reviews})
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{serviceName(p)}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm">
                    <MapPin className="size-4 text-primary" /> {p.location}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-extrabold text-primary">₹{p.price}</span>
                    <Badge variant="secondary">{p.slots.length} slots</Badge>
                  </div>
                  <Button className="mt-4 w-full" onClick={() => setActive(p)}>
                    Book now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BookingDialog
        provider={active}
        serviceName={active ? serviceName(active) : ""}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function BookingDialog({
  provider,
  serviceName,
  onClose,
}: {
  provider: Provider | null;
  serviceName: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState<string | null>(null);

  const { data: booked = [] } = useQuery({
    queryKey: ["booked-slots", provider?.id, date],
    queryFn: () => fetchBookedSlots(provider!.id, date),
    enabled: Boolean(provider && user),
  });

  const book = useMutation({
    mutationFn: () =>
      createBooking({ userId: user!.id, provider: provider!, serviceName, date, slot: slot! }),
    onSuccess: () => {
      toast.success(`Booked ${provider?.name} on ${date} at ${slot}`);
      qc.invalidateQueries({ queryKey: ["booked-slots"] });
      qc.invalidateQueries({ queryKey: ["my-appointments"] });
      setSlot(null);
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const free = (provider?.slots ?? []).filter((s) => !booked.includes(s));

  return (
    <Dialog open={Boolean(provider)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{provider?.name}</DialogTitle>
          <DialogDescription>
            {serviceName} · ₹{provider?.price}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Sign in to pick a slot and confirm.</p>
            <Button className="w-full" onClick={() => navigate({ to: "/auth" })}>
              Sign in to book
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSlot(null);
                }}
              />
            </div>
            <div>
              <Label>Available slots</Label>
              {free.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No slots left on this date — try another day.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {free.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        slot === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="w-full"
              disabled={!slot || book.isPending}
              onClick={() => book.mutate()}
            >
              {book.isPending ? "Confirming…" : "Confirm booking"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}