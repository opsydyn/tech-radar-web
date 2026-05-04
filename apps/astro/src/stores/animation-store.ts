import { atom } from "nanostores";

export const animationEnabled = atom(false);

export const toggleAnimations = () => {
  animationEnabled.set(!animationEnabled.get());
};
