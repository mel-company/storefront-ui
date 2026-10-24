import { Icon } from "../../icons";
import styles from "./Rating.module.css";

export interface RatingProps {
  value: number;
  count?: number;
  size?: number;
}

export function Rating({ value, count, size = 14 }: RatingProps) {
  const rounded = Math.round(value);
  return (
    <span className={styles.rating}>
      <span className={styles.stars} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon key={star} name="star" size={size} filled={star <= rounded} className={star > rounded ? styles.empty : undefined} />
        ))}
      </span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}
