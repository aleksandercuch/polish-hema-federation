import styles from "./banner.module.css";
import Image from "next/image";

export const Banner = () => {
    return (
        <div className={styles.banner}>
            <Image src="/banner.jpg" alt="Example image" fill priority />
        </div>
    );
};
