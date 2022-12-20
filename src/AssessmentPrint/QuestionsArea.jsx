import React, { useEffect, useRef, useCallback } from 'react'
import styles from './questionArea.module.css';

function QuestionsArea({ item, index, questions, handleSpillOver, registerRef, pages, moveUpword }) {
    const questionRef = useRef()
    const observerRef = useRef()

    useEffect(() => {
        if (questionRef.current) {

            const allElement = document.querySelectorAll(`#page-target-${index}`)
            let options = {
                root: questionRef.current,
                rootMargin: '0px',
                threshold: 1
            }
            observerRef.current = new IntersectionObserver((entries, self) => {
                entries.reverse()
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        self.unobserve(entry.target)
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

    }, [questionRef.current, handleSpillOver])

    const handleSpace = useCallback((queIndex, line) => {
        const questionDiv = document.querySelectorAll(`[data-question-id="${queIndex}"]`)
        const countLine = document.querySelector(`#question-line-count-${queIndex}`)
        const lastNode = questionDiv[questionDiv.length - 1]
        const currentPage = lastNode.dataset.pageIndex
        if (line > 0) {
            const space = document.createElement("div")
            space.setAttribute('id', `page-target-${currentPage}`)
            space.setAttribute('class', `${styles.line}`)
            space.setAttribute('data-page-index', `${currentPage}`)
            space.setAttribute('data-question-id', `${queIndex}`)
            lastNode.after(space)
            pages[currentPage].observerRef.current.observe(space)
            countLine.innerHTML = questionDiv.length
        } else {
            if (questionDiv.length > 2) {
                pages[currentPage].observerRef.current.unobserve(lastNode)
                lastNode.parentNode.removeChild(lastNode)
                countLine.innerHTML = questionDiv.length - 2;
                moveUpword(currentPage)

            }
        }
    }, [pages.length, moveUpword])

    return (
        <div className={styles.textarea}>
            <div
                ref={questionRef}
                className={styles.input}
            >
                {
                    (index == 0) && Object.values(questions)?.map(({ text, space }, qi) => {
                        return (<>
                            <div data-question-id={qi} data-page-index={index} id={`page-target-${index}`} className={styles.question} >
                                <div dangerouslySetInnerHTML={{ __html: text }} />
                                <div className={styles.addSpaceBtns}>
                                    <button data-question-index={qi} onClick={() => handleSpace(qi, 1)} >add</button>
                                    <div className={styles.lineCount} id={`question-line-count-${qi}`}>{space}</div>
                                    <button data-question-index={qi} onClick={() => handleSpace(qi, -1)} >remove</button>
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