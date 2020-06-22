import { Player } from "../types/DomainModels";

export const dummyHand = [
  { text: "Making a pouty face." },
  { text: "William Shatner." },
  { text: "Heteronormativity." },
  { text: "Nickelback." },
  { text: "Tom Cruise." },
  { text: "The profoundly handicapped." },
  { text: "The placenta." },
  { text: "Chainsaws for hands." },
  { text: "Arnold Schwarzenegger." },
  { text: "An icepick lobotomy." },
];
export const otherPlayers: Player[] = [
  {
    name: "Squirtle",
    id: "asdsf",
    hand: dummyHand,
  },
  {
    name: "Bulbasaur",
    id: "asdgbvv",
    hand: dummyHand,
  },
  {
    name: "Charmander",
    id: "1087",
    hand: dummyHand,
  },
  {
    name: "Chancey",
    id: "asdsfsda",
    hand: dummyHand,
  },
  {
    name: "Jynx",
    id: "asdgbvvsd",
    hand: dummyHand,
  },
  {
    name: "Tentacool",
    id: "1087sds",
    hand: dummyHand,
  },
];

export const defaultPlayer: Player = {
  name: "Charizard",
  id: "12355",
  hand: dummyHand,
};

export const blackCard = {
  text: "Hey Reddit! I'm _. Ask me anything.",
  pick: 1,
} as const;
export const doublePickBlackCard = {
  text: "And the Academy Award for _ goes to _.",
  pick: 2,
} as const;
