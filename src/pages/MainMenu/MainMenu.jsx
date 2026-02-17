import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MainMenu.module.css'
import mainMenuImg from '../../assets/main_menu_img.png'
import mainMenuImg4k from '../../assets/main_menu_img-4k.png'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

function MainMenu() {
  const navigate = useNavigate()
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(mainMenuImg)
  const [texts, setTexts] = useState([])

  useEffect(() => {
    // Определяем, нужно ли использовать 4K изображение
    // Для экранов с шириной >= 2560px или высотой >= 1440px используем 4K версию
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? mainMenuImg4k : mainMenuImg)

    // Загружаем тексты из JSON файла
    fetch('/data/progressPoints.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        // Преобразуем данные: используем label как text
        const formattedTexts = data.map(item => ({
          id: item.id,
          text: item.label
        }))
        setTexts(formattedTexts)
      })
      .catch((err) => {
        console.error('Error loading progress points:', err)
        setTexts([])
      })
  }, [])

  const handleNextText = () => {
    if (texts.length > 0 && currentTextIndex < texts.length - 1) {
      setCurrentTextIndex((prev) => prev + 1)
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const handleDetails = () => {
    navigate('/submenu')
  }

  const handleCatalog = () => {
    navigate('/main-section')
  }

  return (
    <div className={styles.mainMenu}>
      <div 
        className={styles.mainMenuBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className={styles.mainMenuContent}>
        {/* Центральный блок с текстом */}
        <div className={styles.mainMenuCenter}>
          <div className={styles.mainMenuTextContainer}>
          <div className={styles.mainMenuTextBlock}>
              <span 
                className={styles.mainMenuText}
                dangerouslySetInnerHTML={{ __html: texts[currentTextIndex]?.text || '' }}
              />
              <div className={styles.buttons}>
                <button
                  className={styles.mainMenuDetailsBtn}
                  onClick={handleDetails}
                >
                  Подробнее
                </button>
                <div className={styles.controls}>
                  <button 
                    className={styles.mainMenuArrow}
                    onClick={handlePrevText}
                    disabled={currentTextIndex === 0}
                    aria-label="Предыдущий текст"
                  >
                    <ArrowBackIosNewIcon/>
                  </button>
                  <button
                    className={styles.mainMenuArrow}
                    onClick={handleNextText}
                    disabled={currentTextIndex === texts.length - 1}
                    aria-label="Следующий текст"
                  >
                    <ArrowForwardIosIcon/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка "Перейти в каталог" справа от центра */}
        <div className={styles.mainMenuCatalogBtnContainer}>
          <button 
            className={styles.mainMenuCatalogBtn}
            onClick={handleCatalog}
          >
            Перейти в каталог
          </button>
              </div>
      </div>
    </div>
  )
}

export default MainMenu
