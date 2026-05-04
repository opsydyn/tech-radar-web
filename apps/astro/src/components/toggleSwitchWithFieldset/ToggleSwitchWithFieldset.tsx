import * as styles from "./ToggleSwitchWithFieldset.css";

type ToggleState = "on" | "off";

type ToggleProps = {
  notify: ToggleState;
  onToggle: (value: ToggleState) => void;
  label: { on: string; off: string };
};

const ToggleSwitchWIthFieldset = ({ notify, onToggle, label }: ToggleProps) => {
  return (
    <fieldset className={styles.toggleControlWrapper}>
      {/* <legend>Toggle table view</legend> */}
      <input
        type="radio"
        id="notify-on"
        name="notify"
        value="on"
        checked={notify === "on"}
        onChange={(e) => onToggle(e.target.value as ToggleState)}
      />
      <label htmlFor="notify-on">{label.on}</label>
      <input
        type="radio"
        id="notify-off"
        name="notify"
        value="off"
        checked={notify === "off"}
        onChange={(e) => onToggle(e.target.value as ToggleState)}
      />
      <label htmlFor="notify-off">{label.off}</label>
    </fieldset>
  );
};

export default ToggleSwitchWIthFieldset;
