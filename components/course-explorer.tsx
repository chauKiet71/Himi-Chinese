"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { HskCourseCard, type HskCourseSummary } from "@/components/hsk-course-card";
import type { Course } from "@/lib/content-types";

const filters = ["Tất cả", "Nền tảng", "Văn phòng", "Nhà máy", "Logistics", "Kinh doanh", "Dịch vụ"];
export function CourseExplorer({
  courses,
  hskSummary,
  includeHskCard = false,
}: {
  courses: Course[];
  hskSummary: HskCourseSummary;
  includeHskCard?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const visibleCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesFilter = filter === "Tất cả" || course.category === filter;
      const haystack = `${course.title} ${course.chineseTitle} ${course.description}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [courses, filter, query]);
  const normalizedQuery = query.trim().toLowerCase();
  const showHskCard = includeHskCard
    && (filter === "Tất cả" || filter === "Nền tảng")
    && (!normalizedQuery || "giáo trình hsk 汉语水平考试 cấp độ nền tảng".includes(normalizedQuery));
  const availableCount = visibleCourses.filter((course) => course.availability === "available").length + (showHskCard ? 1 : 0);
  const resultCount = visibleCourses.length + (showHskCard ? 1 : 0);

  return <section className="section-shell explorer">
    <div className="explorer-toolbar">
      <label className="search-box"><Search aria-hidden="true" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm ngành hoặc kỹ năng cần học..." aria-label="Tìm lộ trình" /></label>
      <div className="filter-scroll-wrap">
        <div className="filter-list" aria-label="Lọc theo nhóm ngành. Trên điện thoại, vuốt ngang để xem thêm lựa chọn." role="group">{filters.map((item) => <button
          aria-pressed={filter === item}
          className={`filter-chip ${filter === item ? "active" : ""}`}
          key={item}
          onClick={() => setFilter(item)}
          tabIndex={0}
          type="button"
        >{item}</button>)}</div>
        <span aria-hidden="true" className="filter-scroll-cue"><ChevronRight size={17} /></span>
      </div>
    </div>
    <p aria-live="polite" className="explorer-count" key={`${resultCount}-${availableCount}`}>{availableCount} lộ trình đang mở · {resultCount - availableCount} lộ trình trong kế hoạch</p>
    {resultCount ? <div className="course-grid">{showHskCard ? <div
        className="course-motion-item"
        key="hsk-curriculum"
      ><HskCourseCard {...hskSummary} /></div> : null}{visibleCourses.map((course, index) => <div
        className="course-motion-item"
        key={course.slug}
      ><CourseCard course={course} priority={index < (showHskCard ? 2 : 3)} /></div>)}</div> : <div
        className="empty-state"
      ><h2>Chưa tìm thấy lộ trình</h2><p>Thử một từ khóa khác hoặc chọn “Tất cả”.</p></div>}
  </section>;
}
