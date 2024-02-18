"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

import { Button } from "@/components/ui/button";

export const Social = () => {
  return (
    <div className="grid grid-cols-2 gap-2 px-6">
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <RiKakaoTalkFill className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <SiNaver className="h-5 w-5" color="#03C75A" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
