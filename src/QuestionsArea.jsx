import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, questions, handleSpace, handleSpillOver, registerRef}) {
    const questionRef = useRef()
    const observerRef = useRef()
    useEffect(() => {
        if(questionRef.current) {
            // if(item.observerRef.current) item.observerRef.current.disconnect()

            const allElement = document.querySelectorAll(`#page-target-${index}`)
            let options = {
                root: questionRef.current,
                rootMargin: '0px',
                threshold: 1
            }
            observerRef.current = new IntersectionObserver((entries, self) => {
                console.log(">>> entried : ", {entries, index})
                entries.reverse()
                entries.forEach(entry => {
                    if(!entry.isIntersecting){
                        self.unobserve(entry.target)
                        console.log({out: entry.target.innerHTML})
                        handleSpillOver(index, entry.target)
                    }
                })
            }, options);

            allElement.forEach(ele => {
                observerRef.current.observe(ele)
            })

            registerRef(index, questionRef, observerRef)

        }

        return () => {
            observerRef.current.disconnect()
        }

    },[questionRef.current])

    useEffect(() => {
        const allElement = document.querySelectorAll(`#page-target-${index}`)
        console.log(">>> observer target added :", {allElement, index})
        allElement.forEach(ele => {
            item.observerRef.current.observe(ele)
        })
    },[questions])
    
  return (
    <div className={styles.textarea}>
        <div 
        ref={questionRef} 
        className={styles.input} 
        >
        {
            (index==0) && Object.values(questions)?.map(({text, space}, qi) => {
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