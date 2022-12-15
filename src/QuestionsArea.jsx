import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, questions, handleSpillOver, registerRef}) {
    const questionRef = useRef()
    const observerRef = useRef()

    const observerAllNode = () => {
        const allElement = document.querySelectorAll(`#page-target-${index}`)
        allElement.forEach(ele => {
            observerRef.current.observe(ele)
        })
    }

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
                        console.log({out: entry.target})
                        handleSpillOver(entry.target)
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
        if(observerRef.current) {
            observerAllNode()
        }  
    },[questions])
    
    
    const handleSpace = (e, queIndex, line) => {
        const questionDiv = document.querySelectorAll(`[data-question-id="${queIndex}"]`)
        const lastNode = questionDiv[questionDiv.length-1] 
        console.log(">>> current question : ", questionDiv, lastNode)
        if(line > 0) {
            const space = document.createElement("div")
            space.setAttribute('id', `page-target-${index}`)
            space.setAttribute('class', `${styles.line}`)
            space.setAttribute('data-page-index', `${index}`)
            space.setAttribute('data-question-id', `${queIndex}`)
            lastNode.after(space)
            observerAllNode()
            console.log(">>> child added for question : ", queIndex, space)
        } else {
            console.log(">>> remove last node: ", lastNode)
            if(questionDiv.length > 2) {
                lastNode.parentNode.removeChild(lastNode)
            }
        }
    }
  return (
    <div className={styles.textarea}>
        <div 
        ref={questionRef} 
        className={styles.input} 
        >
        {
            (index==0) && Object.values(questions)?.map(({text, space}, qi) => {
            return (<>
                <div data-question-id={qi} data-page-index={index} id={`page-target-${index}`} className={styles.question} >
                    <div dangerouslySetInnerHTML={{__html: text}} />
                    <div className={styles.addSpaceBtns}>
                        <button data-question-index={qi} onClick={(e) => handleSpace(e,qi, 1)} >add</button>
                        <button data-question-index={qi} onClick={(e) => handleSpace(e, qi, -1)} >remove</button>
                    </div>
                </div>
                {
                [...Array(space)].map((line, li) => {
                    return <div key={`line-${li}`} data-question-id={qi} data-page-index={index} id={`page-target-${index}`} className={styles.line} />
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