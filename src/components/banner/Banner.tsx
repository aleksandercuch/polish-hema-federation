import styles from "./banner.module.css";
import Image from 'next/image';

export const Banner = () => {
    return (
      <div className={styles.banner}>
        <Image
        src="/next.svg"
        alt="Example image"
        fill               
        priority
      />
      </div>
    );
  }