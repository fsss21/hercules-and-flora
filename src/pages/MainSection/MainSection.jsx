import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MainSection.module.css'
import mainSectionImg from '../../assets/main_section_img.png'
import mainSectionImg4k from '../../assets/main_section_img-4k.png'
import mainSectionItemImg from '../../assets/main_section_item_img.png'

const DEFAULT_SECTION_POINTS = [
  { id: 1, label: 'Техники реставрации мрамора' },
  { id: 2, label: 'климат и скульптура' },
  { id: 3, label: 'Александровский сад: история и современность' },
]

function MainSection() {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(mainSectionImg)
  const [sectionPoints, setSectionPoints] = useState([])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? mainSectionImg4k : mainSectionImg)

    fetch('/data/progressPointsSection.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        const list = Array.isArray(data) && data.length >= 3 ? data : []
        setSectionPoints(list)
      })
      .catch(() => setSectionPoints([]))
  }, [])

  const pointsToShow = sectionPoints.length >= 3 ? sectionPoints : DEFAULT_SECTION_POINTS

  const handleSectionButton = (index) => {
    navigate('/submenu', { state: { dataSource: 'section', initialIndex: index } })
  }

  const getButtonLabel = (point) => {
    const html = point.progressLineLabel ?? point.label
    return html ?? ''
  }

  const handleCatalog = () => {
    navigate('/catalog')
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={styles.mainSection}>
      <div
        className={styles.mainSectionBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className={styles.mainSectionContent}>
        <div className={styles.mainSectionButtons}>
          {pointsToShow.slice(0, 3).map((point, index) => (
            <button
              key={point.id ?? index}
              type="button"
              className={styles.mainSectionBtn}
              onClick={() => handleSectionButton(index)}
              dangerouslySetInnerHTML={{ __html: getButtonLabel(point) || `Раздел ${index + 1}` }}
            />
          ))}
        </div>
        <div className={styles.mainSectionBtnMainWrap}>
          <img
            src={mainSectionItemImg}
            alt=""
            className={styles.mainSectionItemImg}
          />
          <button
            type="button"
            className={styles.mainSectionBtnMain}
            onClick={handleCatalog}
          >
            Узнать подробнее о скульптурах этого зала
          </button>
        </div>

        <div className={styles.mainSectionBottom}>
          <button type="button" className={styles.mainSectionBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainSection
