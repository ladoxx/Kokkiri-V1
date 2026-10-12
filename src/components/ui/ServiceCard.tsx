import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ServiceItem } from "@/lib/data/initial-data";

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isKokkiri = service.brandSlug === "kokkiri";
  const brandHref = isKokkiri ? `/cleaning/services` : `/koto/${service.slug}`;
  const accentColor = isKokkiri ? "text-[#173F30]" : "text-[#243A50]";
  const borderHover = isKokkiri ? "hover:border-[#173F30]/40" : "hover:border-[#243A50]/40";
  const badgeBg = isKokkiri ? "bg-[#173F30]/10 text-[#173F30]" : "bg-[#243A50]/10 text-[#243A50]";

  return (
    <div
      className={`bg-white rounded-3xl p-7 border border-[#202622]/10 ${borderHover} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between group`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${badgeBg}`}>
            {isKokkiri ? "KOKKIRI 클리닝" : "KOTO AI 보안·시설"}
          </span>
          <span className="text-xs text-gray-400 font-mono">0{service.order}</span>
        </div>

        <h3 className="text-xl font-extrabold text-[#202622] tracking-tight mb-1 group-hover:text-[#173F30] transition-colors">
          {service.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium mb-3">{service.subtitle}</p>

        <p className="text-sm text-[#202622]/70 leading-relaxed mb-6">
          {service.summary}
        </p>

        <div className="space-y-2 mb-6 pt-4 border-t border-black/5">
          {service.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#202622]/80">
              <CheckCircle2 className={`w-3.5 h-3.5 ${accentColor} shrink-0 mt-0.5`} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-black/5 flex items-center justify-between">
        <Link
          href={brandHref}
          className={`inline-flex items-center gap-1.5 text-xs font-bold ${accentColor} group-hover:underline`}
        >
          <span>서비스 상세 및 견적 안내</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
