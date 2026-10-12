import React from "react";
import { Building, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { ProjectItem } from "@/lib/data/initial-data";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isKokkiri = project.brandSlug === "kokkiri";
  const badgeColor = isKokkiri ? "bg-[#173F30] text-white" : "bg-[#243A50] text-white";

  return (
    <div className="bg-white rounded-3xl border border-[#202622]/10 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Cover Header Graphic Area */}
        <div className={`p-6 sm:p-8 ${isKokkiri ? "bg-[#173F30]/5" : "bg-[#243A50]/5"} border-b border-black/5`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>
              {project.category}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {isKokkiri ? "KOKKIRI 클리닝" : "KOTO AI보안 & 시설"}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-[#202622] tracking-tight leading-snug group-hover:text-[#173F30] transition-colors mb-3">
            {project.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {project.client && (
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>{project.client}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{project.location}</span>
              </div>
            )}
            {project.completedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{project.completedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content & Results */}
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold text-[#173F30] mb-2">{project.summary}</p>
          <p className="text-xs text-[#202622]/70 leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="space-y-2 pt-4 border-t border-black/5">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              수행 성과 및 지표
            </div>
            {project.results.map((res, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#202622]/85">
                <CheckCircle2 className="w-4 h-4 text-[#477B56] shrink-0 mt-0.5" />
                <span>{res}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
