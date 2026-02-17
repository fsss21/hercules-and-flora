import { useState } from 'react'
import styles from './ProgressLine.module.css'
import progressLineLabelActiveBg from '../../assets/progressLineLabelActive.png'

function ProgressLine({ points = [], onPointClick, activeIndex }) {
  const [internalActive, setInternalActive] = useState(0)
  const isControlled = activeIndex !== undefined && activeIndex !== null
  const activePoint = isControlled ? activeIndex : internalActive

  const handlePointClick = (index) => {
    if (!isControlled) setInternalActive(index)
    if (onPointClick) onPointClick(index)
  }

  return (
    <div className={styles.progressLine}>
      <div className={styles.progressLineLine}>
        {points.map((point, index) => (
          <div
            key={point.id || index}
            className={`${styles.progressLinePoint} ${activePoint === index ? styles.progressLinePointActive : ''
              }`}
            onClick={() => handlePointClick(index)}
          >
            <div
              className={activePoint === index ? styles.progressLineLabelWrapActive : styles.progressLineLabelWrap}
              onClick={(e) => {
                e.stopPropagation()
                handlePointClick(index)
              }}
            >
              {activePoint === index && (
                <div
                  className={styles.progressLineLabelBg}
                  style={{
                    backgroundImage: `url(${progressLineLabelActiveBg})`,
                  }}
                  aria-hidden
                />
              )}
              <div
                className={styles.progressLineLabel}
                dangerouslySetInnerHTML={{ __html: point.progressLineLabel ?? point.label ?? `Точка ${index + 1}` }}
              />
            </div>
            <div className={styles.progressLineDot}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressLine

