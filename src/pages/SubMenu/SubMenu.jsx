import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProgressLine from '../../components/ProgressLine/ProgressLine'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import styles from './SubMenu.module.css'
import subMenuImg from '../../assets/sub_menu_img.png'
import subMenuImg4k from '../../assets/sub_menu_img-4k.png'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const DATA_URL_MAIN = '/data/progressPoints.json'
const DATA_URL_SECTION = '/data/progressPointsSection.json'

function SubMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const fromSection = location.state?.dataSource === 'section'
  const initialIndex = Math.max(0, Number(location.state?.initialIndex) || 0)

  const [selectedPoint, setSelectedPoint] = useState(initialIndex)
  const [progressPoints, setProgressPoints] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(subMenuImg)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? subMenuImg4k : subMenuImg)

    const dataUrl = fromSection ? DATA_URL_SECTION : DATA_URL_MAIN
    fetch(dataUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setProgressPoints(list)
        const idx = list.length ? Math.min(initialIndex, list.length - 1) : 0
        setSelectedPoint(idx)
        setCurrentPhotoIndex(0)
      })
      .catch((err) => {
        console.error('Error loading progress points:', err)
        setProgressPoints([])
      })
  }, [fromSection])

  // Сбрасываем индекс фото при смене точки
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [selectedPoint])

  const handlePointClick = (index) => {
    if (index >= 0 && index < progressPoints.length) {
      setSelectedPoint(index)
      setCurrentTextIndex(0) // Сбрасываем индекс текста при смене точки
      setCurrentPhotoIndex(0) // Сбрасываем индекс фото при смене точки
    }
  }

  const handleNextText = () => {
    const currentPoint = progressPoints[selectedPoint]
    if (currentPoint && currentPoint.texts && currentPoint.texts.length > 0) {
      if (currentTextIndex < currentPoint.texts.length - 1) {
        setCurrentTextIndex((prev) => prev + 1)
      }
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const handleBack = () => {
    if (fromSection) {
      navigate('/main-section')
    } else {
      navigate('/')
    }
  }

  const handleNextPhoto = () => {
    const currentPoint = progressPoints[selectedPoint]
    const photos = currentPoint?.photos || []
    if (photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }
  }

  const handlePrevPhoto = () => {
    const currentPoint = progressPoints[selectedPoint]
    const photos = currentPoint?.photos || []
    if (photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  const currentPoint = progressPoints[selectedPoint]
  const currentPhotos = currentPoint?.photos || []

  return (
    <div className={styles.subMenu}>
      <div 
        className={styles.subMenuBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className={styles.subMenuContent}>
        <ProgressLine points={progressPoints} onPointClick={handlePointClick} activeIndex={selectedPoint} />
        <div className={styles.subMenuMainContent}>
          <div className={styles.subMenuMainContentMenu}>
            <div className={styles.subMenuTextBlock}>
              {currentPoint && (
                <>
                  <h2 
                    className={styles.subMenuTextPoint}
                    dangerouslySetInnerHTML={{ __html: currentPoint.label }}
                  />
                  {currentPoint.texts && currentPoint.texts.length > 0 && (
                    <p 
                      className={styles.subMenuTextDescription}
                      dangerouslySetInnerHTML={{ __html: currentPoint.texts[currentTextIndex] || '' }}
                    />
                  )}
                  <div className={styles.subMenuBottomNavigation}>
                    <div className={styles.controlsNavMenu}>
                      <button className={`${styles.subMenuBtn} ${styles.subMenuBtnBack}`} onClick={handleBack}>
                        Назад
                      </button>
                    </div>
                    {currentPoint.texts && currentPoint.texts.length > 1 && (
                      <div className={styles.subMenuTextNavigation}>
                        <button 
                          className={styles.subMenuTextNavBtn}
                          onClick={handlePrevText}
                          disabled={currentTextIndex === 0}
                          aria-label="Предыдущий текст"
                        >
                          <ArrowBackIosNewIcon/>
                        </button>
                        <span className={styles.subMenuTextCounter}>
                          {currentTextIndex + 1} / {currentPoint.texts.length}
                        </span>
                        <button 
                          className={styles.subMenuTextNavBtn}
                          onClick={handleNextText}
                          disabled={currentTextIndex === currentPoint.texts.length - 1}
                          aria-label="Следующий текст"
                        >
                          <ArrowForwardIosIcon/>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.subMenuGalleryBlock}>
            <div className={styles.subMenuGalleryWrapper}>
              <PhotoGallery 
                photos={currentPhotos} 
                showControls={false} 
                showArrows={isFullscreen}
                showFullscreen={isFullscreen}
                onCloseFullscreen={handleCloseFullscreen}
                currentIndex={currentPhotoIndex}
                onIndexChange={setCurrentPhotoIndex}
              />
            </div>
            {currentPhotos.length > 0 && (
              <div className={styles.subMenuGalleryControls}>
                <div className={styles.subMenuNav}>
                  <button 
                    className={styles.subMenuGalleryNavBtn}
                    onClick={handlePrevPhoto}
                    disabled={currentPhotos.length <= 1}
                    aria-label="Предыдущее фото"
                  >
                    <ArrowBackIosNewIcon/>
                  </button>
                  <span className={styles.subMenuGalleryCounter}>
                    {currentPhotoIndex + 1} / {currentPhotos.length}
                  </span>
                  <button 
                    className={styles.subMenuGalleryNavBtn}
                    onClick={handleNextPhoto}
                    disabled={currentPhotos.length <= 1}
                    aria-label="Следующее фото"
                  >
                    <ArrowForwardIosIcon/>
                  </button>
                </div>
                <button 
                  className={styles.fullscreenButton}
                  onClick={handleFullscreen}
                  aria-label="Полноэкранный режим"
                >
                  <FullscreenIcon fontSize='large'/>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubMenu
