import React, { useState, useEffect, useRef } from "react";
import { db } from "../pages/Firebase";
import { collection, getDocs } from "firebase/firestore";
import NavbarCompany from "../components/NavbarCompany";

const SWIPE_THRESHOLD = 120;

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const draggingRef = useRef(false);
  const activeCardRef = useRef(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      const snapshot = await getDocs(collection(db, "resumes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplicants(data);
    };

    fetchApplicants();
  }, []);

  const updateCardPositions = () => {
    const cards = document.querySelectorAll(".swipe-card");
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.index, 10);
      const diff = idx - currentIndex;

      if (diff < 0) {
        card.style.display = "none";
      } else if (diff === 0) {
        card.style.display = "block";
        card.style.transform =
          "translateX(0) rotate(0deg) scale(1)";
        card.style.opacity = "1";
        card.style.zIndex = "15";
      } else if (diff === 1) {
        card.style.display = "block";
        card.style.transform = "scale(0.95) translateY(12px)";
        card.style.opacity = "0.85";
        card.style.zIndex = "10";
      } else {
        card.style.display = "block";
        card.style.transform = "scale(0.90) translateY(22px)";
        card.style.opacity = "0.55";
        card.style.zIndex = "5";
      }

      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;

      card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    });
  };

  useEffect(updateCardPositions, [currentIndex, applicants]);

  /* === DRAG HANDLERS === */
  const handleMove = (clientX) => {
    if (!draggingRef.current) return;

    currentXRef.current = clientX;
    const diff = clientX - startXRef.current;
    const card = activeCardRef.current;

    if (!card) return;

    const rotation = diff / 20;
    card.style.transition = "none";
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;

    const accept = card.querySelector(".indicator-accept");
    const decline = card.querySelector(".indicator-decline");

    if (accept) accept.style.opacity = diff > 0 ? Math.min(diff / 150, 1) : 0;
    if (decline) decline.style.opacity = diff < 0 ? Math.min(-diff / 150, 1) : 0;
  };

  const endSwipe = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    const card = activeCardRef.current;
    if (!card) return;

    const diff = currentXRef.current - startXRef.current;
    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";

    if (diff > SWIPE_THRESHOLD) {
      card.style.transform = "translateX(1200px) rotate(30deg)";
      card.style.opacity = 0;
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else if (diff < -SWIPE_THRESHOLD) {
      card.style.transform = "translateX(-1200px) rotate(-30deg)";
      card.style.opacity = 0;
      setTimeout(() => setCurrentIndex((p) => p + 1), 300);
    } else {
      card.style.transform = "translateX(0) rotate(0deg)";

      const accept = card.querySelector(".indicator-accept");
      const decline = card.querySelector(".indicator-decline");
      if (accept) accept.style.opacity = 0;
      if (decline) decline.style.opacity = 0;
    }

    setTimeout(() => {
      if (activeCardRef.current)
        activeCardRef.current.style.transition = "";
      activeCardRef.current = null;
    }, 350);
  };

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

  /* === TOUCH === */
  const handleTouchStart = (e, index) => {
    if (index !== currentIndex) return;
    draggingRef.current = true;
    activeCardRef.current = e.currentTarget;
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!draggingRef.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => endSwipe();

  const swipeLeft = () => animateSwipe("left");
  const swipeRight = () => animateSwipe("right");

  const animateSwipe = (direction) => {
    const card = document.querySelector(`[data-index="${currentIndex}"]`);
    if (!card) return;

    card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
    card.style.transform =
      direction === "right"
        ? "translateX(1200px) rotate(30deg)"
        : "translateX(-1200px) rotate(-30deg)";
    card.style.opacity = 0;

    setTimeout(() => setCurrentIndex((p) => p + 1), 300);
  };

  const renderCard = (applicant, index) => {
    const initials = applicant.fullName
      ? applicant.fullName.split(" ").map((c) => c[0]).join("")
      : "NA";

    return (
      <div
        key={applicant.id}
        data-index={index}
        onPointerDown={(e) => handlePointerDown(e, index)}
        onTouchStart={(e) => handleTouchStart(e, index)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        className="
          swipe-card absolute inset-0 bg-white shadow-xl border rounded-2xl
          p-6 md:p-8 overflow-y-auto
          transition-all duration-300
        "
      >
        {/* Top Banner */}
        <div className="
          w-full h-40 md:h-48 rounded-xl
          bg-gradient-to-br from-blue-300 to-blue-900
          flex items-center justify-center text-white text-3xl font-bold mb-6
        ">
          {initials}
        </div>

        <div className="text-2xl font-bold text-blue-900 break-words">
          {applicant.fullName}
        </div>
        <p className="text-gray-600 mb-4 break-words">{applicant.email}</p>

        {/* Details */}
        <div className="flex flex-col gap-3 text-left">
          {[
            ["👤", applicant.aboutMe],
            ["🎂", applicant.birthday],
            ["🏙️", applicant.city],
            ["🎓", applicant.education],
            ["⚧", applicant.gender],
            ["💼", applicant.jobPreferences],
            ["🗣️", applicant.languages],
            ["💍", applicant.maritalStatus],
            ["📞", applicant.phoneNumber],
            ["🛠️", applicant.skills],
            ["🏢", applicant.workExperience],
            [
              "⏰",
              applicant.submittedAt
                ? new Date(
                    applicant.submittedAt.seconds * 1000
                  ).toLocaleString()
                : "N/A",
            ],
          ].map(([icon, value], i) => (
            <div
              key={i}
              className="flex gap-2 items-start text-gray-800 break-words"
            >
              <span>{icon}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Swipe Indicators */}
        <div
          className="
          indicator-accept absolute top-10 right-6 
          opacity-0 pointer-events-none
          px-6 py-3 rounded-xl border-4
          text-green-500 border-green-500 font-extrabold text-3xl
          bg-white/70 backdrop-blur-md rotate-6
        "
        >
          APPLY
        </div>

        <div
          className="
          indicator-decline absolute top-10 left-6
          opacity-0 pointer-events-none
          px-6 py-3 rounded-xl border-4
          text-red-500 border-red-500 font-extrabold text-3xl
          bg-white/70 backdrop-blur-md -rotate-6
        "
        >
          DECLINE
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">
        <NavbarCompany />
        <div className="flex flex-col items-center w-full px-4 py-10">
          <p className="text-gray-800 font-medium mb-6">
            Swipe right to accept, left to decline.
          </p>
          <div className="relative w-full max-w-xl h-[650px]">
            {applicants.length === 0 ? (
              <div className="text-center text-gray-700">Loading applicants...</div>
            ) : currentIndex >= applicants.length ? (
              <div className="text-center text-gray-700 text-xl font-semibold">
                No more applicants to review!
              </div>
            ) : (
              applicants.map((app, i) => renderCard(app, i))
            )}
          </div>
          {/* Action buttons */}
          <div className="flex gap-10 mt-8">
            <button
              onClick={swipeLeft}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500 text-white text-2xl shadow-lg hover:scale-110 hover:shadow-xl transition"
            >
              ✕
            </button>
            <button
              onClick={swipeRight}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-500 text-white text-2xl shadow-lg hover:scale-110 hover:shadow-xl transition"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 p-6 text-gray-400 text-center">
        CareerMatch © 2025 — All rights reserved.
      </footer>
    </>
  );
}
