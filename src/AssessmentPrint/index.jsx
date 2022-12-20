import { useState, useCallback } from "react";
import styles from "./index.module.css";
// import { useReactToPrint } from 'react-to-print';
import { IMAGE_POSITIONS, QUESTIONS } from "./constant";
import QuestionsArea from "./QuestionsArea";
import { getImage } from "./helper";

export default function AssessmentPrint({ data = QUESTIONS }) {
	const [questions, setQuestions] = useState(data);

	const [pages, setPages] = useState([
		{
			id: 1,
			value: "1",
		},
		{
			id: 2,
			value: "2",
		},
	]);

	const handleSpillOver = useCallback((element) => {
		const pageIndex = Number(element.dataset.pageIndex);
		const nextPage = pageIndex + 1;

		if (
			nextPage < pages.length &&
			pages?.[nextPage].ref.current &&
			pages?.[nextPage].observerRef.current
		) {
			element.setAttribute("id", `page-target-${nextPage}`);
			element.setAttribute("data-page-index", `${nextPage}`);
			pages[nextPage].ref.current.prepend(element);
			pages[nextPage].observerRef.current.observe(element);
		}

		if (nextPage + 1 === pages.length) {
			setPages((pages) => {
				if (nextPage + 1 === pages.length) {
					return [
						...pages,
						{
							id: pages.length + 1,
							value: "1",
						},
					];
				} else {
					return [...pages];
				}
			});
		}
	}, [pages.length])

	const registerRef = (index, questionRef, observerRef) => {
		setPages((pages) => {
			return pages.map((p, i) => {
				if (i === index) {
					(p.ref = questionRef), (p.observerRef = observerRef);
				}
				return p;
			});
		});
	};

	const moveUpword = useCallback((pageIndex) => {
		let currentPage = Number(pageIndex);
		let nextPage = currentPage + 1;
		while (nextPage < pages.length) {
			const nextPageNodes = pages[nextPage].ref.current.children;
			if (nextPageNodes.length) {
				const firstChild = nextPageNodes[0];
				pages[nextPage].observerRef.current.unobserve(firstChild);

				firstChild.setAttribute("id", `page-target-${currentPage}`);
				firstChild.setAttribute("data-page-index", `${currentPage}`);
				pages[currentPage].ref.current.append(firstChild);
				pages[currentPage].observerRef.current.observe(firstChild);

				currentPage = nextPage;
				nextPage += 1;
			} else {
				if (nextPage < pages.length - 1) {
					setPages((pages) => {
						if (nextPage < pages.length - 1) {
							return pages.slice(0, pages.length - 1);
						} else {
							return [...pages];
						}
					});
				}
				break;
			}
		}
	}, [pages.length])

	return (
		<div className={styles.main}>
			{pages.map((item, index) => {
				return (
					<div key={item.id} className={styles.page}>
						{/* info and top section */}
						<div
							className={styles.topSection}
							style={{ height: index % 2 == 1 ? "10%" : "20%" }}
						>
							<img
								src={getImage(IMAGE_POSITIONS.TOP, index)}
								className={styles.infoImgSection}
							/>
						</div>

						{/* middle section */}
						<div
							className={styles.middleSection}
							style={{ height: index % 2 == 1 ? "80%" : "70%" }}
						>
							<div className={styles.snoSection}>
								<img
									src={getImage(IMAGE_POSITIONS.MIDDLE, index)}
									className={styles.snoImgSection}
								/>
							</div>

							<QuestionsArea
								item={item}
								index={index}
								questions={questions}
								handleSpillOver={handleSpillOver}
								registerRef={registerRef}
								pages={pages}
								moveUpword={moveUpword}
							/>
						</div>

						{/* footer section */}
						<div className={styles.footerSection}>
							<img
								src={getImage(IMAGE_POSITIONS.FOOTER, index)}
								className={styles.footerImgSection}
							/>
						</div>
					</div>
				);
			})}
			{/* <button onClick={handlePrint}>Print this out!</button> */}
		</div>
	);
}
