import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, quesitons, handleSpace, handleSpillOver}) {
    // console.log(">>>> question area for ", index)
    const pageObserverRootRef = useRef()

    useEffect(() => {
        // console.log(">>> question area useeffect called : ", {root:pageObserverRootRef?.current, index })
        if(pageObserverRootRef?.current) {
            if(item.observerRef.current) item.observerRef.current.disconnect()

            // console.log(">>> page ready ", {root:pageObserverRootRef?.current, index })
            const allElement = document.querySelectorAll(`#page-target-${index}`)
            // console.log({allElement})
            let options = {
                root: pageObserverRootRef?.current,
                rootMargin: '0px',
                threshold: 1
            }
            item.observerRef.current = new IntersectionObserver((entries, self) => {
                // console.log({entries})
                entries.forEach(entry => {
                    if(!entry.isIntersecting){
                        // console.log({out: entry.target.innerHTML})
                        handleSpillOver(index, entry.target, self)
                    }
                })
            }, options);

            // const {current: currentObserver} = item.observerRef

            allElement.forEach(ele => {
                item.observerRef.current.observe(ele)
            })

            // item.observerRef.current = observer;
        }

        return () => {
            item.observerRef.current.disconnect()
        }

    },[pageObserverRootRef?.current])
    
  return (
    <div ref={pageObserverRootRef} id={`pages-${index}`} className={styles.textarea}>
        <div 
        ref={item.ref} 
        className={styles.input} 
        >
        {
            (index==0) && quesitons?.map(({text, space}, qi) => {
            return (<>
                <div id={`page-target-${index}`} className={styles.question} dangerouslySetInnerHTML={{__html: text}}  />
                {
                [...Array(space)].map((line, li) => {
                    return (
                    <>
                    <div id={`page-target-${index}`} className={styles.line}>
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