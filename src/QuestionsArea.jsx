import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, quesitons, handleSpace, handleSpillOver}) {

    useEffect(() => {
        if(item.ref.current) {
            if(item.observerRef.current) item.observerRef.current.disconnect()

            const allElement = document.querySelectorAll(`#page-target-${index}`)
            let options = {
                root: item.ref.current,
                rootMargin: '0px',
                threshold: 1
            }
            item.observerRef.current = new IntersectionObserver((entries, self) => {
                console.log(">>> entried : ", {entries, index})
                entries.reverse()
                entries.forEach(entry => {
                    if(!entry.isIntersecting){
                        console.log({out: entry.target.innerHTML})
                        handleSpillOver(index, entry.target, self)
                    }
                })
            }, options);

            allElement.forEach(ele => {
                item.observerRef.current.observe(ele)
            })

        }

        return () => {
            item.observerRef.current.disconnect()
        }

    },[item.ref.current])

    // useEffect(() => {
    //     const allElement = document.querySelectorAll(`#page-target-${index}`)
    //     console.log(">>> observer target added :", {allElement, index})
    //     allElement.forEach(ele => {
    //         item.observerRef.current.observe(ele)
    //     })
    // },[quesitons])
    
  return (
    <div className={styles.textarea}>
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
    </div>
  )
}

export default QuestionsArea