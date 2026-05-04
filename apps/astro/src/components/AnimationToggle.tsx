import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { animationEnabled, toggleAnimations } from "~stores/animation-store";
import * as styles from "./AnimationToggle.css";
import { useEffect } from "react";

export const AnimationToggle = () => {
  const isEnabled = useStore(animationEnabled);

  // Update animations when the state changes
  useEffect(() => {
    console.log("Animation state changed:", isEnabled);
    
    // Add or remove the animations-disabled class on the HTML element
    // Note: We're using a disabled class instead of enabled to match our default state
    if (isEnabled) {
      console.log("Enabling animations");
      document.documentElement.classList.remove('animations-disabled');
      document.documentElement.classList.add('animations-enabled');
    } else {
      console.log("Disabling animations");
      document.documentElement.classList.add('animations-disabled');
      document.documentElement.classList.remove('animations-enabled');
    }
    
    // Log the current class list to verify
    console.log("HTML classes:", document.documentElement.classList.toString());
  }, [isEnabled]);

  const handleToggle = () => {
    console.log("Toggle button clicked, current state:", animationEnabled.get());
    toggleAnimations();
    console.log("New state after toggle:", animationEnabled.get());
  };

  return (
    <motion.button
      className={styles.toggleButton}
      onClick={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      title={isEnabled ? "Disable Radar animations" : "Enable radar animations"}
    >
      {isEnabled ? "Radar: ON" : "Radar: OFF"}
    </motion.button>
  );
};
