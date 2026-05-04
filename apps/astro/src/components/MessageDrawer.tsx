import { useState, useCallback } from 'react';
import { 
  makeStyles, 
  shorthands, 
  tokens, 
  Text, 
  Button,
  Badge,
  mergeClasses
} from '@fluentui/react-components';
import { Drawer } from 'vaul';
import TechRadarTable from './table/TechRadarTable';
import type { Blip } from './table/types';

// Define props for the MessageDrawer component
type MessageDrawerProps = {
  blips: Array<Blip>;
};

// Create styles using Fluent UI's makeStyles
const useStyles = makeStyles({
  drawerTrigger: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: tokens.colorBrandBackground,
    color: 'white',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding('10px', '20px'),
    ...shorthands.border('2px', 'solid', 'white'),
    cursor: 'pointer',
    zIndex: 100,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
    }
  },
  bottomHandle: {
    position: 'fixed',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
    cursor: 'pointer',
    zIndex: 100,
    ...shorthands.padding('8px', '0', '0', '0'),
    ...shorthands.margin('0', 'auto'),
    '&::before': {
      content: '""',
      display: 'block',
      width: '50px',
      height: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '3px',
      margin: '0 auto',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      '&::before': {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }
    }
  },
  drawerContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    color: 'white',
    ...shorthands.padding('16px'),
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderTopRightRadius: tokens.borderRadiusLarge,
    ...shorthands.borderTop('3px', 'solid', tokens.colorBrandStroke1),
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin('0', '0', '16px', '0'),
    ...shorthands.borderBottom('1px', 'solid', 'rgba(255, 255, 255, 0.2)'),
    ...shorthands.padding('0', '0', '8px', '0'),
  },
  drawerHandle: {
    width: '50px',
    height: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '3px',
    margin: '0 auto 16px',
  },
  drawerOverlay: {
    backgroundColor: 'transparent', // Transparent overlay to allow interaction with background
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    pointerEvents: 'none', // Allow clicks to pass through
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },
});

/**
 * MessageDrawer component using Vaul for a bottom drawer containing the Tech Radar table
 */
export const MessageDrawer = ({
  blips
}: MessageDrawerProps) => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Drawer trigger button */}
      {/* <Button 
        appearance="primary"
        className={styles.drawerTrigger}
        onClick={() => setIsOpen(true)}
      >
        Tech Radar Table
      </Button> */}
      
      {/* Bottom handle to drag up */}
      <div 
        className={styles.bottomHandle}
        onClick={() => setIsOpen(true)}
        aria-label="Open tech radar table"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
          }
        }}
      />
      
      {/* Vaul drawer component */}
      <Drawer.Root 
        open={isOpen} 
        onOpenChange={setIsOpen}
        direction="bottom"
        modal={false} // Non-modal to allow interaction with background
        dismissible={true}
      >
        <Drawer.Portal>
          <Drawer.Overlay className={styles.drawerOverlay} />
          <Drawer.Content className={styles.drawerContent}>
            {/* Add DialogTitle for accessibility */}
            <Drawer.Title className={styles.visuallyHidden}>Tech Radar Table</Drawer.Title>
            <div className={styles.drawerHandle} />
            
            <div className={styles.drawerHeader}>
              <Text size={500} weight="semibold">Tech Radar Table</Text>
              <Button appearance="subtle" onClick={() => setIsOpen(false)}>
                Collapse
              </Button>
            </div>
            
            <div style={{ display: 'flex', height: 'calc(100% - 60px)', overflow: 'auto' }}>
              {/* Tech Radar Table */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                <TechRadarTable blips={blips} />
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

export default MessageDrawer;
