"use client";

import { useEffect, useRef, useState } from "react";
import type { CompanyHit } from "@/lib/company-search";

export function CompanyNameField({
  value,
  disabled,
  onNameChange,
  onPick,
}: {
  value: string;
  disabled: boolean;
  onNameChange: (name: string) => void;
  onPick: (hit: CompanyHit) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(0);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<CompanyHit[]>([]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setItems([]);
      return;
    }
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      setSource("");
      setError("");
      setBusy(false);
      return;
    }
    const ac = new AbortController();
    const timer = window.setTimeout(() => {
      setBusy(true);
      fetch(`/api/companies?q=${encodeURIComponent(q)}`, { signal: ac.signal, cache: "no-store" })
        .then((r) => r.json())
        .then((data: { items?: CompanyHit[]; source?: string; error?: string }) => {
          if (ac.signal.aborted) return;
          setItems(Array.isArray(data.items) ? data.items : []);
          setSource(data.source ?? "");
          setError(data.error ?? "");
          setActive(0);
          setOpen(true);
        })
        .catch(() => {
          if (!ac.signal.aborted) {
            setItems([]);
            setSource("");
            setError("無法連線經濟部商工登記，請改以完整名稱輸入。");
          }
        })
        .finally(() => {
          if (!ac.signal.aborted) setBusy(false);
        });
    }, 280);
    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [value, disabled]);

  useEffect(() => {
    function onDoc(ev: MouseEvent) {
      if (!boxRef.current?.contains(ev.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(hit: CompanyHit) {
    onPick(hit);
    setOpen(false);
    setItems([]);
  }

  function onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || items.length === 0) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((i) => (i + 1) % items.length);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((i) => (i - 1 + items.length) % items.length);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      pick(items[active] ?? items[0]);
    } else if (ev.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        className="wb-case-input w-[320px]"
        placeholder="請輸入公司名稱"
        value={value}
        disabled={disabled}
        autoComplete="off"
        onChange={(e) => {
          onNameChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (items.length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />
      {open && value.trim().length >= 2 ? (
        <div className="wb-suggest">
          {busy && items.length === 0 ? <p className="wb-suggest-note">查詢經濟部商工登記…</p> : null}
          {!busy && items.length === 0 ? (
            <p className="wb-suggest-note">{error || "查無符合之核准設立公司。"}</p>
          ) : null}
          {items.map((hit, i) => (
            <button
              key={`${hit.taxId}-${hit.name}`}
              type="button"
              className={i === active ? "wb-suggest-item active" : "wb-suggest-item"}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(hit)}
            >
              <span className="wb-suggest-name">{hit.name}</span>
              <span className="wb-suggest-meta">
                {hit.taxId ? `統編 ${hit.taxId}` : ""}
                {hit.capitalBillion != null ? `　實收資本額 ${hit.capitalBillion} 億元` : ""}
              </span>
            </button>
          ))}
          {source ? <p className="wb-suggest-source">資料來源：{source}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
