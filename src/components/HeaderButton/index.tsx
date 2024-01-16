import styles from './index.module.scss';

interface HeaderButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

export default function HeaderButton(props: HeaderButtonProps) {
  return <button className={styles.wrapper} {...props} />;
}
