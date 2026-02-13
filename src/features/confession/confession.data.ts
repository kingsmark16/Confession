import youImage from "../../assets/you.png";

export type Memory = {
  alt: string;
  caption: string;
  description: string;
  image: string;
  tilt: string;
};

export type Reason = {
  copy: string;
  icon: "sparkles" | "smile" | "zap";
  title: string;
  tone: "black" | "red" | "yellow";
};

export const memories: Memory[] = [
  {
    alt: "A Moment of us",
    caption: "We might not have a real photo together but this is the closest we have.",
    description:
      "Do you remember this moment? Because I still do. Sometimes, a single, unexpected interaction can completely change the way we see someone and that is exactly how I fell for you. You startled my heart so deeply that my mind simply cannot stop thinking about you.",
    image: youImage,
    tilt: "tilt-soft",
  },
];

export const reasons: Reason[] = [
  {
    copy: "Your eyes make every ordinary moment feel like a secret written just for me.",
    icon: "sparkles",
    title: "YOUR EYES!",
    tone: "yellow",
  },
  {
    copy: "Your smiles turn even the quietest day into my favorite kind of beautiful chaos.",
    icon: "smile",
    title: "YOUR SMILES!",
    tone: "red",
  },
  {
    copy: "Your energy makes life feel brighter, braver, and wildly more alive.",
    icon: "zap",
    title: "YOUR ENERGY!",
    tone: "black",
  },
];
