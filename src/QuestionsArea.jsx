import React, { useEffect, useRef } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({item, index, questions, handleSpillOver, registerRef}) {
    const questionRef = useRef()
    const observerRef = useRef()

    const observerAllNode = () => {
        const allElement = document.querySelectorAll(`#page-target-${index}`)
        // console.log(">>> observer target added :", {allElement, index})
        // console.log(">>> childrebn: ", questionRef.current.children)
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
                        const pageIndex = entry.target.dataset.pageIndex
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
        const questionDiv = document.querySelector(`#question-id-${queIndex}`)
        if(line > 0) {
            const space = document.createElement("div")
            space.setAttribute('id', `page-target-${index}`)
            space.setAttribute('class', `${styles.line}`)
            space.setAttribute('data-page-index', `${index}`)
            questionDiv.append(space)
            observerAllNode()
            console.log(">>> child added for question : ", queIndex, space)
        } else {
            const children = questionDiv.children
            if(children.length > 2) {
                const lastNode = children[children.length-1]
                questionDiv.removeChild(lastNode)

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
            return (<div key={`question-id-${qi}`} id={`question-id-${qi}`}>
                <div data-page-index={index} id={`page-target-${index}`} className={styles.question} >
                    <div dangerouslySetInnerHTML={{__html: text}} />
                    <div className={styles.addSpaceBtns}>
                        <button data-question-index={qi} onClick={(e) => handleSpace(e,qi, 1)} >add</button>
                        <button data-question-index={qi} onClick={(e) => handleSpace(e, qi, -1)} >remove</button>
                    </div>
                </div>
                {
                [...Array(space)].map((line, li) => {
                    return <div key={`line-${li}`} data-page-index={index} id={`page-target-${index}`} className={styles.line} />
                })
                }
            </div>)
            })
        }
        </div>
    </div>
  )
}

export default QuestionsArea