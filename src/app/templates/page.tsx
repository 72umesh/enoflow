"use client";

import Link from "next/link";
import { flowTemplates, templateCategories } from "@/data/templates";
import { useFlowStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  Workflow, ArrowLeft, ArrowRight, Sparkles, Webhook, Database,
  Type, Clock, List, Play,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Webhook, Database, Type, Clock, List,
};

const difficultyColors = {
  beginner: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  intermediate: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  advanced: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { loadFlow } = useFlowStore();
  const router = useRouter();

  const filtered = flowTemplates.filter((t) => {
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    const template = flowTemplates.find((t) => t.id === templateId);
    if (template) {
      loadFlow(template.flow);
      router.push("/editor");
    }
  };

  return (
    <div className="min-h-screen bg-[#11111b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#11111b]/80 backdrop-blur-xl border-b border-[#313244]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </Link>
            <div className="w-px h-4 bg-[#313244]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                <Workflow className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">EnoFlow</span>
            </div>
          </div>
          <Link
            href="/editor"
            className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            Open Editor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Flow Templates</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start from a pre-built template and customize it to your needs. Learn common automation patterns.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !selectedCategory
                ? "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30"
                : "bg-[#1e1e2e] text-gray-400 border border-[#313244] hover:text-white"
            }`}
          >
            All
          </button>
          {templateCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30"
                  : "bg-[#1e1e2e] text-gray-400 border border-[#313244] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((template) => {
            const Icon = iconMap[template.icon] || Sparkles;
            const diff = difficultyColors[template.difficulty];

            return (
              <div
                key={template.id}
                className="group rounded-xl bg-[#181825] border border-[#313244] hover:border-[#8b5cf6]/30 transition-all overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#8b5cf6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-0.5 truncate">{template.name}</h3>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${diff.bg} ${diff.text} border ${diff.border}`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{template.description}</p>
                </div>

                {/* Stats */}
                <div className="px-5 pb-3 flex items-center gap-3">
                  <span className="text-[10px] text-gray-500">
                    {template.flow.nodes.length} nodes
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {template.flow.edges.length} connections
                  </span>
                  <span className="text-[10px] text-gray-500 px-1.5 py-0.5 bg-[#1e1e2e] rounded">
                    {template.category}
                  </span>
                </div>

                {/* Action */}
                <div className="px-5 pb-4">
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-medium rounded-lg transition-all border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Use Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-2">No templates found</p>
            <p className="text-xs text-gray-500">Try a different search or category</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#313244] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[#8b5cf6]" />
            <span className="text-sm font-semibold">EnoFlow</span>
          </div>
          <p className="text-xs text-gray-500">
            Built with Next.js, React Flow, and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
