"use client";

import Link from "next/link";
import { docSections } from "@/data/docs";
import {
  Workflow, ArrowLeft, ArrowRight, Play, Zap, ArrowRightLeft,
  GitBranch, CheckCircle, Link2, Footprints, ShieldCheck, Save,
  Lightbulb, Search,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Workflow, Play, Zap, ArrowRightLeft, GitBranch, CheckCircle,
  Link: Link2, Footprints, ShieldCheck, Save, Lightbulb,
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(docSections[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = docSections.filter(
    (s) =>
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = docSections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#11111b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#11111b]/80 backdrop-blur-xl border-b border-[#313244]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
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
              <span className="text-xs text-gray-500">Docs</span>
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

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-20">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e2e] border border-[#313244] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] transition-colors"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-0.5">
              {filteredSections.map((section) => {
                const Icon = iconMap[section.icon] || Workflow;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? "bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20"
                        : "text-gray-400 hover:text-white hover:bg-[#1e1e2e]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{section.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Links */}
            <div className="mt-6 pt-4 border-t border-[#313244]">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2 px-3">Quick Links</p>
              <div className="space-y-1">
                <Link
                  href="/editor"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1e1e2e]"
                >
                  <Play className="w-3.5 h-3.5" />
                  Open Editor
                </Link>
                <Link
                  href="/templates"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1e1e2e]"
                >
                  <Workflow className="w-3.5 h-3.5" />
                  Templates
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeDoc ? (
            <article className="max-w-3xl">
              {/* Mobile section selector */}
              <div className="lg:hidden mb-6">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="w-full bg-[#1e1e2e] border border-[#313244] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6]"
                >
                  {docSections.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = iconMap[activeDoc.icon] || Workflow;
                    return <Icon className="w-5 h-5 text-[#8b5cf6]" />;
                  })()}
                  <h1 className="text-2xl font-bold">{activeDoc.title}</h1>
                </div>
              </div>

              {/* Content */}
              <div className="prose-docs">
                {activeDoc.content.split("\n\n").map((paragraph, i) => {
                  if (paragraph.startsWith("**") && paragraph.includes("**")) {
                    // Bold header line
                    const parts = paragraph.split("\n");
                    return (
                      <div key={i} className="mb-6">
                        {parts.map((part, j) => {
                          if (part.startsWith("**")) {
                            const title = part.replace(/\*\*/g, "");
                            return (
                              <h3 key={j} className="text-base font-semibold text-white mb-2 mt-4 first:mt-0">
                                {title}
                              </h3>
                            );
                          }
                          // Process inline bold
                          const processed = part.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-white font-semibold">$1</strong>'
                          );
                          // Process inline code
                          const withCode = processed.replace(
                            /`(.*?)`/g,
                            '<code class="text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'
                          );
                          return (
                            <p
                              key={j}
                              className="text-sm text-gray-300 leading-relaxed mb-2"
                              dangerouslySetInnerHTML={{ __html: withCode }}
                            />
                          );
                        })}
                      </div>
                    );
                  }

                  // Process inline formatting
                  const processed = paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-white font-semibold">$1</strong>'
                  );
                  const withCode = processed.replace(
                    /`(.*?)`/g,
                    '<code class="text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>'
                  );

                  return (
                    <p
                      key={i}
                      className="text-sm text-gray-300 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: withCode }}
                    />
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-12 pt-6 border-t border-[#313244] flex justify-between">
                {(() => {
                  const currentIndex = docSections.findIndex((s) => s.id === activeSection);
                  const prev = currentIndex > 0 ? docSections[currentIndex - 1] : null;
                  const next = currentIndex < docSections.length - 1 ? docSections[currentIndex + 1] : null;

                  return (
                    <>
                      {prev ? (
                        <button
                          onClick={() => setActiveSection(prev.id)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {prev.title}
                        </button>
                      ) : <div />}
                      {next ? (
                        <button
                          onClick={() => setActiveSection(next.id)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {next.title}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </article>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Select a topic from the sidebar</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#313244] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
