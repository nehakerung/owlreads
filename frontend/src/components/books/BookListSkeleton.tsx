import styles from '@/app/book/search/SearchContent.module.css';

type BookListSkeletonProps = {
  loadingMessage: string;
  count?: number;
};

export function BookListSkeleton({
  loadingMessage,
  count = 3,
}: BookListSkeletonProps) {
  return (
    <>
      <div className={styles.stateLoading}>{loadingMessage}</div>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.skeletonCard} aria-hidden="true">
          <div className={styles.skeletonGlow} />
          <div
            className={styles.skeletonBlock}
            style={{ width: 96, height: 128 }}
          />
          <div style={{ flex: 1 }}>
            <div
              className={styles.skeletonBlock}
              style={{ width: '60%', height: 16, marginBottom: 10 }}
            />
            <div
              className={styles.skeletonBlock}
              style={{ width: '80%', height: 12, marginBottom: 10 }}
            />
            <div
              className={styles.skeletonBlock}
              style={{ width: '70%', height: 12 }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
