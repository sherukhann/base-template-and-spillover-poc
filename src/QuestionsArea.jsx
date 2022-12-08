import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, quesitons, handleSpace, handleSpillOver}) {
    console.log(">>>> question area for ", index)
    const pageObserverRootRef = useRef()

    useEffect(() => {
        console.log(">>> question area useeffect called : ", {root:pageObserverRootRef?.current, index })
        if(pageObserverRootRef?.current) {
            console.log(">>> page ready ", {root:pageObserverRootRef?.current, index })
            const allElement = document.querySelectorAll(`#page-target-${index}`)
            console.log({allElement})
            let options = {
                root: pageObserverRootRef?.current,
                rootMargin: '0px',
                threshold: 0.1
            }
            let observer = new IntersectionObserver((entries, self) => {
                console.log({entries})
                entries.forEach(entry => {
                    if(!entry.isIntersecting){
                        console.log({out: entry.target.innerHTML})
                        handleSpillOver(index, entry.target, self)
                    }
                })
            }, options);

            allElement.forEach(ele => {
                observer.observe(ele)
            })

            item.observerRef.current = observer;
        }

    },[pageObserverRootRef?.current])
    
  return (
    <div ref={pageObserverRootRef} className={styles.textarea}>
        <div 
        ref={item.ref} 
        className={styles.input} 
        >
        {
            (index==0) && quesitons?.map(({text, space}, qi) => {
            return (<>
                <div data-page-index={index} id={`page-target-${index}`} className={styles.question} dangerouslySetInnerHTML={{__html: text}}  />
                {
                [...Array(space)].map((line, li) => {
                    return (
                    <>
                    <div data-page-index={index} id={`page-target-${index}`} className={styles.line}>
                        {li+1}
                        {
                            (space === li+1) && (
                                <div className={styles.addSpaceBtns}>
                                    <button data-question-index={qi} onClick={(e) => handleSpace(e, 1)} >add</button>
                                    <button data-question-index={qi} onClick={(e) => handleSpace(e, -1)} >remove</button>
                                </div>
                            )
                        }
                    </div>
                    </>
                    )
                })
                }
            </>)
            })
        }
        </div>
        {/* observer
        <div id={`page-observer-${index}`} className={styles.observer}></div> */}
    </div>
  )
}

export default QuestionsArea