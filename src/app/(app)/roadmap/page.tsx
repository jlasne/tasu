"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: "planned" | "in_progress" | "done";
  category: string | null;
  vote_count: number;
  sort_order: number;
}

const statusConfig = {
  planned: { label: "Planned", color: "bg-cream dark:bg-dark-bg text-warm-gray dark:text-dark-muted border-cream-dark dark:border-dark-border" },
  in_progress: { label: "In progress", color: "bg-blue-50 text-blue-700 border-blue-200" },
  done: { label: "Done", color: "bg-green-50 text-green-700 border-green-200" },
};

function RoadmapCard({
  item,
  voted,
  onVote,
}: {
  item: RoadmapItem;
  voted: boolean;
  onVote: (id: string, voted: boolean) => void;
}) {
  const status = statusConfig[item.status] ?? statusConfig.planned;
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-cream-dark dark:border-dark-border p-5 flex items-start gap-4 group transition-all hover:border-terracotta/20">
      {/* Vote */}
      <button
        onClick={() => onVote(item.id, voted)}
        className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all shrink-0 ${
          voted
            ? "bg-terracotta/10 border-terracotta/30 text-terracotta"
            : "bg-cream dark:bg-dark-bg border-cream-dark dark:border-dark-border text-warm-gray dark:text-dark-muted hover:border-terracotta/30 hover:text-terracotta"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
        <span className="text-xs font-semibold">{item.vote_count}</span>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text">{item.title}</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
            {status.label}
          </span>
          {item.category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-cream dark:bg-dark-bg text-warm-gray dark:text-dark-muted border-cream-dark dark:border-dark-border">
              {item.category}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-warm-gray dark:text-dark-muted leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const [{ data: roadmapItems }, { data: myVotes }] = await Promise.all([
      supabase
        .from("roadmap_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("vote_count", { ascending: false }),
      supabase
        .from("roadmap_votes")
        .select("item_id")
        .eq("user_id", user.id),
    ]);

    if (roadmapItems) setItems(roadmapItems as RoadmapItem[]);
    if (myVotes) setVotedIds(new Set(myVotes.map((v) => v.item_id)));
    setLoading(false);
  }

  async function handleVote(itemId: string, alreadyVoted: boolean) {
    if (!userId) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, vote_count: item.vote_count + (alreadyVoted ? -1 : 1) }
          : item
      )
    );
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (alreadyVoted) { next.delete(itemId); } else { next.add(itemId); }
      return next;
    });

    if (alreadyVoted) {
      await supabase
        .from("roadmap_votes")
        .delete()
        .eq("item_id", itemId)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("roadmap_votes")
        .insert({ item_id: itemId, user_id: userId });
    }
  }

  const grouped = {
    in_progress: items.filter((i) => i.status === "in_progress"),
    planned: items.filter((i) => i.status === "planned"),
    done: items.filter((i) => i.status === "done"),
  };

  return (
    <div className="flex-1 overflow-y-auto bg-cream dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text mb-1">Roadmap</h1>
          <p className="text-sm text-warm-gray dark:text-dark-muted">
            Vote on what you&apos;d like to see next. We build what matters most to founders.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gray/25 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-gray dark:text-dark-muted text-sm">Roadmap coming soon.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.in_progress.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide mb-3">
                  In progress
                </h2>
                <div className="space-y-3">
                  {grouped.in_progress.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      voted={votedIds.has(item.id)}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </section>
            )}

            {grouped.planned.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide mb-3">
                  Planned — vote to prioritise
                </h2>
                <div className="space-y-3">
                  {grouped.planned.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      voted={votedIds.has(item.id)}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </section>
            )}

            {grouped.done.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-warm-gray dark:text-dark-muted uppercase tracking-wide mb-3">
                  Shipped
                </h2>
                <div className="space-y-3 opacity-70">
                  {grouped.done.map((item) => (
                    <RoadmapCard
                      key={item.id}
                      item={item}
                      voted={votedIds.has(item.id)}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
