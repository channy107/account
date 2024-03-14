"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const sentences = [
  "안녕하세요.",
  "하찮은코딩 하찮은개발자 \n임헌찬입니다.",
  "저는 앞서 회원가입/로그인과 더불어",
  "관리자페이지, 쇼핑몰, \n생성형 ai 서비스 등등",
  "다양한 서비스를 \n기획/개발 중에 있습니다.",
  "해당 페이지는 서비스 개발 완료 전 \n임시 대시보드 페이지입니다.",
  "빠른 시일 내로 개발해 \n업데이트 하도록 하겠습니다.",
  "감사합니다!!",
];

const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenSentences = 1500;

const Temporary = () => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;

    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      timeoutId = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timeoutId = setTimeout(() => {
        setCurrentText(
          sentences[currentSentenceIndex].slice(0, currentText.length + 1)
        );
      }, typingSpeed);
    }

    const currentSentence = sentences[currentSentenceIndex];

    if (!isDeleting && currentText === currentSentence) {
      setIsDeleting(true);
      timeoutId = setTimeout(() => setIsDeleting(false), delayBetweenSentences);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentSentenceIndex((prev) => prev + 1);
    }

    if (
      currentSentenceIndex >= sentences.length - 1 &&
      currentText === currentSentence &&
      !isDeleting
    ) {
      setIsFinished(true);
    }

    return () => clearTimeout(timeoutId);
  }, [
    currentText,
    isDeleting,
    currentSentenceIndex,
    sentences,
    delayBetweenSentences,
    deletingSpeed,
    typingSpeed,
    isFinished,
  ]);

  const resetTyping = () => {
    setCurrentSentenceIndex(0);
    setCurrentText("");
    setIsDeleting(false);
    setIsFinished(false);
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-black px-4">
      <p className="text-white text-2xl md:text-4xl font-bold mb-4 max-w-[340px] md:max-w-[600px] mx-auto text-center whitespace-pre-wrap">
        {currentText}
      </p>
      {isFinished && (
        <div className="flex  items-center justify-center gap-2">
          <Button
            onClick={resetTyping}
            size={"sm"}
            className=" bg-white text-black font-bold hover:bg-white"
          >
            다시보기
          </Button>
          <Button
            onClick={handleLogout}
            size={"sm"}
            className=" bg-white text-black font-bold hover:bg-white"
          >
            로그아웃
          </Button>
        </div>
      )}
    </div>
  );
};

export default Temporary;
