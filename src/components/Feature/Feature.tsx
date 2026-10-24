import { Icon, type IconName } from "../../icons";
import { cx } from "../../utils";
import styles from "./Feature.module.css";

export interface FeatureProps {
  icon: IconName;
  title: string;
  text?: string;
  layout?: "inline" | "stacked";
}

export function Feature({ icon, title, text, layout = "inline" }: FeatureProps) {
  return (
    <div className={cx(styles.feature, layout === "stacked" && styles.stacked)}>
      <span className={styles.icon}>
        <Icon name={icon} size={22} />
      </span>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </div>
  );
}
