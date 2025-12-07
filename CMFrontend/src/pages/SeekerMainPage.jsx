import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../pages/Firebase";
import NavbarSeeker from "../components/NavbarSeeker";

const SWIPE_THRESHOLD = 120;

export default function SeekerMainPage() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Swipe refs
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const q = query(
          collection(db, "jobPosts"),
          orderBy("datePosted", "desc")
        );
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map((doc) => doc.data());
        setJobs(jobsData);
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
    };

    loadJobs();
  }, []);

  // Update card stack visual layout
  useEffect(() => {
    updateCardPositions();
  }, [currentIndex, jobs]);

  const updateCardPositions = () => {
    const cards = document.querySelectorAll(".job-card");

    cards.forEach((card) => {
      const idx = Number(card.dataset.index);
      const diff = idx - currentIndex;

      card.style.position = "absolute";
      card.style.inset = "0";
      card.style.display = diff < 0 ? "none" : "block";

      if (diff === 0) {
        card.style.transform = "translateX(0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "10";
      } else if (diff === 1) {
        card.style.transform = "scale(0.95) translateY(10px)";
        card.style.opacity = "0.85";
        card.style.zIndex = "9";
      } else {
        card.style.transform = "scale(0.9) translateY(20px)";
        card.style.opacity = "0.6";
        card.style.zIndex = "8";
      }

      card.style.transition = "transform 0.3s ease, opacity 0.3s ease";

      const accept = card.querySelector(".swipe-accept");
      const decline = card.querySelector(".swipe-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;
    });
  };

  // Handle swipe motion
  const handleMove = (clientX) => {
    if (!draggingRef.current) return;

    currentXRef.current = clientX;

    const diff = clientX - startXRef.current;
    const card = activeCardRef.current;

    if (!card) return;

    const rotation = diff / 20;

    card.style.transition = "none";
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;

    const accept = card.querySelector(".swipe-accept");
    const decline = card.querySelector(".swipe-decline");

    if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
    if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
  };

  // Save swipe result
  const saveSwipe = async (job, status) => {
    try {
      await addDoc(collection(db, "userApplications"), {
        jobTitle: job.title,
        company: job.company,
        status,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error saving swipe:", err);
    }
  };

  // When swipe ends
  const endSwipe = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    const card = activeCardRef.current;
    if (!card) return;

    const diff = currentXRef.current - startXRef.current;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";

    const job = jobs[currentIndex];
    const isLast = currentIndex === jobs.length - 1;
    const threshold = isLast ? 50 : SWIPE_THRESHOLD;

    if (diff > threshold) {
      // Right swipe
      card.style.transform = "translateX(1200px) rotate(30deg)";
      card.style.opacity = "0";
      saveSwipe(job, "Accepted");
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    } else if (diff < -threshold) {
      // Left swipe
      card.style.transform = "translateX(-1200px) rotate(-30deg)";
      card.style.opacity = "0";
      saveSwipe(job, "Denied");
      setTimeout(() => setCurrentIndex((i) => i + 1), 300);
    } else {
      // Reset card
      card.style.transform = "translateX(0) rotate(0deg)";
      const a = card.querySelector(".swipe-accept");
      const d = card.querySelector(".swipe-decline");
      if (a) a.style.opacity = 0;
      if (d) d.style.opacity = 0;
    }

    setTimeout(() => {
      if (activeCardRef.current)
        activeCardRef.current.style.transition = "";
      activeCardRef.current = null;
    }, 350);
  };

  // Pointer down event
  const handlePointerDown = (e, index) => {
    if (index !== currentIndex) return;

    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;

    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;

    const moveHandler = (ev) => handleMove(ev.clientX);
    const upHandler = () => {
      window.removeEventListener("pointermove", moveHandler);
      window.removeEventListener("pointerup", upHandler);
      endSwipe();
    };

    window.addEventListener("pointermove", moveHandler);
    window.addEventListener("pointerup", upHandler);
  };

  // Button-triggered swipe
  const animateSwipe = (direction) => {
    const card = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!card) return;

    const job = jobs[currentIndex];
    if (!job) return;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    card.style.transform =
      direction === "right"
        ? "translateX(1200px) rotate(30deg)"
        : "translateX(-1200px) rotate(-30deg)";
    card.style.opacity = "0";

    saveSwipe(job, direction === "right" ? "Accepted" : "Denied");

    setTimeout(() => setCurrentIndex((i) => i + 1), 300);
  };

  // Render job card
  const renderCard = (job, index) => {
    const logoHTML = job?.logo
      ? `<img src="${job.logo}" class="w-full h-full object-cover rounded-xl" />`
      : job.company?.substring(0, 2).toUpperCase() || "CM";

    return (
      <div
        key={index}
        data-index={index}
        onPointerDown={(e) => handlePointerDown(e, index)}
        className="job-card bg-white rounded-2xl shadow-xl border p-8 cursor-grab"
      >
        {/* Logo */}
        <div
          className="w-full h-52 rounded-xl bg-linear-to-br from-blue-300 to-blue-900 flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden mb-5"
          dangerouslySetInnerHTML={{ __html: logoHTML }}
        />

        <div className="text-2xl font-bold text-gray-800">{job.title}</div>
        <div className="text-gray-500 text-sm mb-4">{job.company}</div>

        <div className="space-y-2 text-gray-700">
          <p>📍 {job.location}</p>
          <p>💼 {job.type}</p>
          <p>🎓 {job.degree || "Any"}</p>
          <p>🕒 {job.experience || "Not Specified"}</p>
          <p>⚡ {job.employmentLevel || "N/A"}</p>
          <p>🛠️ {job.skills || "N/A"}</p>
        </div>

        <div className="text-xl font-bold text-blue-600 mt-3">
          {job.salary || "Not specified"}
        </div>

        <div className="text-gray-600 mt-3 leading-relaxed">
          {job.description}
        </div>

        {/* Swipe Indicators */}
        <div className="swipe-accept absolute top-10 right-10 text-green-500 border-4 border-green-500 text-5xl font-black px-6 py-4 bg-white/80 backdrop-blur-md rounded-lg opacity-0 rotate-6 pointer-events-none">
          APPLY
        </div>

        <div className="swipe-decline absolute top-10 left-10 text-red-500 border-4 border-red-500 text-5xl font-black px-6 py-4 bg-white/80 backdrop-blur-md rounded-lg opacity-0 -rotate-6 pointer-events-none">
          DECLINE
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-300 to-blue-900 flex">
      <NavbarSeeker />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex justify-center items-center py-10">
          <div className="w-full max-w-3xl px-6">
            <p className="text-center text-white text-lg mb-6">
              Swipe right to apply, left to decline.
            </p>

            <div className="relative h-[750px] mb-10">
              {jobs.length === 0 ? (
                <p className="text-white text-center">Loading jobs...</p>
              ) : currentIndex >= jobs.length ? (
                <p className="text-white text-center text-xl">
                  No more jobs!
                </p>
              ) : (
                jobs.map((job, idx) => renderCard(job, idx))
              )}
            </div>

            <div className="flex justify-center gap-16">
              <button
                onClick={() => animateSwipe("left")}
                className="w-16 h-16 rounded-full bg-red-500 text-white text-3xl shadow-lg hover:scale-110 transition"
              >
                ✕
              </button>

              <button
                onClick={() => animateSwipe("right")}
                className="w-16 h-16 rounded-full bg-green-500 text-white text-3xl shadow-lg hover:scale-110 transition"
              >
                ✓
              </button>
            </div>
          </div>
        </div>

        <footer className="bg-gray-900 p-6 text-gray-400 text-center">
          CareerMatch © 2025 — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
