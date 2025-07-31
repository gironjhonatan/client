import styles from '../styles/Button.module.css';

export default function Button({ children, onClick, type = "button" }) {
  return (
    <button className={styles.btn} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
