import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './app.module.css'
// import { useReactToPrint } from 'react-to-print';
import {QUESTIONS} from './data';
import QuestionsArea from './QuestionsArea'

// main template
import mainInfoSection from './assets/main_info_section.png';
import mainSnoSection from './assets/main_sno_section.png';
import mainFooterSection from './assets/main_footer_section.png';

// even template
import evenInfoSection from './assets/even_info_section.png';
import evenSnoSection from './assets/even_sno_section.png';
import evenFooterSection from './assets/even_footer_section.png';

// odd template
import oddInfoSection from './assets/odd_info_section.png';
import oddSnoSection from './assets/odd_sno_section.png';
import oddFooterSection from './assets/odd_footer_section.png';

const IMAGE_POSITIONS = {
  TOP: 'top',
  MIDDLE: 'middle',
  FOOTER: 'footer'
}


function App() {
  const [questions, setQuestions] = useState(QUESTIONS)

  const [pages, setPages] = useState([
    {
      id: 1,
      value: "1",
    },
    {
      id: 2,
      value: "2",
    },
  ])
  
  useEffect(() => {
    if(!questions.length) return
    console.log(">>>> question updated", questions)
  }, [questions])

  useEffect(() => {
    console.log(">>>> pages updated", pages)
  }, [pages])

  const handleSpillOver = useCallback((element) => {
    console.log(">>>> handle spillover called with: ", {element, pages })
    const pageIndex = Number(element.dataset.pageIndex)
    const nextPage = pageIndex+1;

    if(nextPage < pages.length && pages?.[nextPage].ref.current && pages?.[nextPage].observerRef.current){
      element.setAttribute('id', `page-target-${nextPage}`)
      element.setAttribute('data-page-index', `${nextPage}`)
      pages[nextPage].ref.current.prepend(element)
      pages[nextPage].observerRef.current.observe(element)
      console.log(">>> element shift to : ", nextPage)
    }

    if(nextPage+1 === pages.length){

      setPages((pages) => {
        if(nextPage+1 === pages.length) {
          return [...pages, {
            id: pages.length + 1,
            value: "1",
          }]
        } else {
          return [...pages]
        }
      })
      console.log(">>>### new pages added for :", nextPage+1)
    }

  }, [pages.length])

  const registerRef = (index, questionRef, observerRef) => {
      setPages((pages) => {
        return pages.map((p,i) => {
          if(i === index) {
            p.ref = questionRef,
            p.observerRef = observerRef
          }
          return p
        })
      })
  }

  return (
    <div className={styles.main}>
      {
        pages.map((item, index) => {
          return (
            <div 
              key={item.id} 
              className={styles.page}
            >
              {/* info and top section */}
              <div className={styles.topSection} style={{ height: index % 2 == 1 ? "10%" : "20%"}}>
                <img src={getImage(IMAGE_POSITIONS.TOP, index)} className={styles.infoImgSection} />
              </div>

              {/* middle section */}
              <div className={styles.middleSection} style={{ height: index % 2 == 1 ? "80%" : "70%"}}>
                <div className={styles.snoSection}>
                  <img src={getImage(IMAGE_POSITIONS.MIDDLE, index)} className={styles.snoImgSection} />
                </div>
                
                  <QuestionsArea 
                    item={item} 
                    index={index} 
                    questions={questions} 
                    // handleSpace={handleSpace}
                    handleSpillOver={handleSpillOver}
                    registerRef={registerRef}
                    pages={pages}
                    // registerObserver={registerObserver}
                  />
              </div>
              
              {/* footer section */}
              <div className={styles.footerSection}>
                <img src={getImage(IMAGE_POSITIONS.FOOTER, index)} className={styles.footerImgSection} />
              </div>
            </div>
          )
        })
      }
      {/* <button onClick={handlePrint}>Print this out!</button> */}
    </div>
  )
}

export default App


function getImage(position, index) {

  if( index == 0) {
    switch(position){
      case IMAGE_POSITIONS.TOP: {
        return mainInfoSection
      };
      case IMAGE_POSITIONS.MIDDLE: {
        return mainSnoSection
      };
      case IMAGE_POSITIONS.FOOTER: {
        return mainFooterSection
      };
      default: {
        return mainInfoSection
      }
    }
  } else if(index % 2 == 0) {
    // odd number case
    switch(position){
      case IMAGE_POSITIONS.TOP: {
        return oddInfoSection
      };
      case IMAGE_POSITIONS.MIDDLE: {
        return oddSnoSection
      };
      case IMAGE_POSITIONS.FOOTER: {
        return oddFooterSection
      };
      default: {
        return oddInfoSection
      }
    }
  } else {
    // even case
    switch(position){
      case IMAGE_POSITIONS.TOP: {
        return evenInfoSection
      };
      case IMAGE_POSITIONS.MIDDLE: {
        return evenSnoSection
      };
      case IMAGE_POSITIONS.FOOTER: {
        return evenFooterSection
      };
      default: {
        return evenInfoSection
      }
    }
  }
}