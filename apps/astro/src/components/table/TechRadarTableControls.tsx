// TechRadarTableControls.tsx
import { useState } from "react";
import * as styles from "~components/table/TechRadarTableControls.css";
import { motion, AnimatePresence } from "framer-motion";

type ToggleOption = "All" | "Cars" | "Vans";

const buttonVariants = {
  initial: { 
    scale: 1,
    backgroundColor: "var(--color-background)",
    y: 0,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
  },
  hover: { 
    scale: 1.05,
    backgroundColor: "var(--color-primary-light)",
    y: -2,
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    backgroundColor: "var(--color-primary-dark)",
    y: 1,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)"
  },
  active: { 
    scale: 1,
    backgroundColor: "var(--color-primary)",
    color: "var(--color-white)",
    y: 0,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TechRadarTableControls = () => {
  const [selectedToggle, setSelectedToggle] = useState<ToggleOption>("All");

  const handleToggle = (option: ToggleOption) => {
    setSelectedToggle(option);
  };

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatePresence>
        <motion.div className={styles.toggleGroup}>
          {(["All", "Cars", "Vans"] as Array<ToggleOption>).map((option, index) => (
            <motion.button
              type="button"
              key={option}
              aria-pressed={selectedToggle === option}
              onClick={() => handleToggle(option)}
              className={styles.toggleButton}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              animate={selectedToggle === option ? "active" : "initial"}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: index * 0.1 
              }}
              layout
            >
              {option}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className={styles.filterControls}>{/* filter controls here */}</div>
    </motion.div>
  );
};

export default TechRadarTableControls;
