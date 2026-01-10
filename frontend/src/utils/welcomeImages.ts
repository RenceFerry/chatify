import { imageIntro1, imageIntro2, imageIntro3, imageIntro4 } from "../assets/export";

type WelcomeImage = {
  title: string;
  sub: string;
  url: string;
}

const welcomeImages : WelcomeImage[] = [
  {
    title: "Group Chatting",
    sub: "Connect with multiple members in group chats.",
    url: imageIntro1
  },
  {
    title: "Video And Voice Calls",
    sub: "Instantly connect via video and voice calls.",
    url: imageIntro2
  },
  {
    title: "Message Encryption",
    sub: "Ensure privacy with encrypted messages.",
    url: imageIntro3
  },
  {
    title: "Cross-Platform Compatibility",
    sub: "Access chat on any device seamlessly.",
    url: imageIntro4
  },
]

export default welcomeImages;