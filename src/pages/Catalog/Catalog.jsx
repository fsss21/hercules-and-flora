import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'
import placeHolderImg from '../../assets/place_holder_img.png'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

function getItemImage(item) {
  if (item?.photos?.length) return item.photos[0]
  return placeHolderImg
}

function getItemDescription(item) {
  if (!item) return ''
  const parts = []
  if (item.sculptor) {
    const short = item.sculptor.split(/[,(]/)[0].trim()
    parts.push(short.length > 40 ? short.slice(0, 40) + '…' : short)
  }
  if (item.creationTime) {
    const t = item.creationTime
    parts.push(t.length > 35 ? t.slice(0, 35) + '…' : t)
  }
  if (item.material) {
    const m = item.material.split(',')[0].trim()
    parts.push(m.length > 30 ? m.slice(0, 30) + '…' : m)
  }
  if (parts.length) return parts.join(' · ')
  if (item.texts?.[0]) {
    const plain = item.texts[0].replace(/<[^>]+>/g, '')
    return plain.slice(0, 80) + (plain.length > 80 ? '…' : '')
  }
  return ''
}

function Catalog() {
  const navigate = useNavigate()
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogImg4k : catalogImg)

    fetch('/data/catalogItems.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error loading catalog items:', err)
        setItems([])
      })
  }, [])

  useEffect(() => {
    setCurrentItemIndex((prev) => Math.min(prev, Math.max(0, items.length - 1)))
  }, [items.length])

  const n = items.length
  const prevIndex = n ? (currentItemIndex - 1 + n) % n : 0
  const nextIndex = n ? (currentItemIndex + 1) % n : 0

  const handlePrev = () => {
    if (!n) return
    setCurrentItemIndex((prev) => (prev - 1 + n) % n)
  }

  const handleNext = () => {
    if (!n) return
    setCurrentItemIndex((prev) => (prev + 1) % n)
  }

  const handleItemClick = (item) => {
    navigate(`/catalog/${item.id}`)
  }

  const handleBack = () => navigate('/main-section')

  const prevItem = items[prevIndex] ?? null
  const currentItem = items[currentItemIndex] ?? null
  const nextItem = items[nextIndex] ?? null

  return (
    <div className={styles.catalog}>
      <div
        className={styles.catalogBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className={styles.catalogContent}>
        <div className={styles.catalogBottomNavigation}>
          <button type="button" className={styles.catalogBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
        <div className={styles.catalogCenter}>
          {items.length === 0 ? (
            <p className={styles.catalogEmpty}>
              В каталоге пока нет предметов.
            </p>
          ) : (
            <div className={styles.catalogCarousel}>
              <button
                type="button"
                className={styles.catalogArrow}
                onClick={handlePrev}
                aria-label="Предыдущий предмет"
              >
                <ArrowBackIosNewIcon />
              </button>

              {prevItem && (
                <button
                  type="button"
                  className={`${styles.catalogCard} ${styles.catalogCardSide}`}

                >
                  <div className={styles.catalogCardImage}>
                    <img src={getItemImage(prevItem)} alt="" />
                  </div>
                  <div className={styles.infoCard}>
                    <h3 className={styles.catalogCardTitle}>{prevItem.name}</h3>
                    <p className={styles.catalogCardDesc}>{getItemDescription(prevItem)}</p>
                  </div>
                </button>
              )}

              {currentItem && (
                <button
                  type="button"
                  className={`${styles.catalogCard} ${styles.catalogCardCenter}`}
                  onClick={() => handleItemClick(currentItem)}
                >
                  <div className={styles.catalogCardImage}>
                    <img src={getItemImage(currentItem)} alt="" />
                  </div>
                  <div className={styles.infoCardActive}>
                    <h3 className={styles.catalogCardTitle}>{currentItem.name}</h3>
                    <p className={styles.catalogCardDesc}>{getItemDescription(currentItem)}</p>
                  </div>
                </button>
              )}

              {nextItem && (
                <button
                  type="button"
                  className={`${styles.catalogCard} ${styles.catalogCardSide}`}

                >
                  <div className={styles.catalogCardImage}>
                    <img src={getItemImage(nextItem)} alt="" />
                  </div>
                  <div className={styles.infoCard}>
                    <h3 className={styles.catalogCardTitle}>{nextItem.name}</h3>
                    <p className={styles.catalogCardDesc}>{getItemDescription(nextItem)}</p>
                  </div>
                </button>
              )}

              <button
                type="button"
                className={styles.catalogArrow}
                onClick={handleNext}
                aria-label="Следующий предмет"
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Catalog
