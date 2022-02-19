import * as React from 'react';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

const App = () => {
	const [ val, setVal ] = useState(100);
	const [ text, setText ] = useState('N/A');
	const [ col, setCol ] = useState('#dddddd');
	const [ popupShown, setPopupShown ] = useState(false);
	const btn = useRef<HTMLButtonElement>();
	const popupOuter = useRef<HTMLDivElement>();
	const popupInner = useRef<HTMLDivElement>();
	const time = useRef<HTMLDivElement>();
	const [ unix, setUnix ] = useState('0');
	const [ int, setInt ] = useState<NodeJS.Timer>();
	let start = moment().unix();

	const openPopup = () => {
		popupOuter.current.classList.remove('opacity-0');
		popupOuter.current.classList.remove('-z-10');
		popupInner.current.classList.remove('translate-y-10');
		setPopupShown(true);
	};

	const closePopup = () => {
		popupOuter.current.classList.add('opacity-0');
		popupInner.current.classList.add('translate-y-10');
		setTimeout(() => {
			popupOuter.current.classList.add('-z-10');
		}, 200);
	};

	const timeClick = (e: any) => {
		e.preventDefault();
		let time: string | number = parseInt(e.currentTarget.textContent);
		const rightButton = e.buttons == 2;
		console.log(rightButton);
		if (rightButton == false) {
			time += 1;
		} else {
			time -= 1;
		}

		if (time > 59) {
			time = 0;
		} else if (time < 0) {
			time = 59;
		}

		if (`${time}`.length == 1) {
			time = `0${time}`;
		}

		e.currentTarget.textContent = `${time}`;
	};

	const getTimeRemaining = () => {
		const seconds = parseInt(unix) - start;
		let total = parseInt(unix) - parseInt(moment().format('X')) / seconds;
		total *= 100;
		total = Math.floor(total);
		console.log(total, seconds, start, unix);
		setVal(total);
		setCol('#ff3434');
		return total;
	};

	const timerStart = () => {
		setInt(
			setInterval(() => {
				const remaining = getTimeRemaining();
				if (remaining <= 0) {
					clearInterval(int);
					setText('Time up!');
					setCol('#00aa00');
				}
			}, 1000)
		);
	};

	const TimePopup = () => {
		return (
			<div
				ref={popupOuter}
				className='opacity-0 transition-all duration-200 bg-black bg-opacity-50 text-black w-screen h-screen grid place-items-center absolute -z-10'
			>
				<div
					ref={popupInner}
					className='transition-all duration-200 translate-y-10 w-2/4 h-2/4 bg-white border border-opacity-25 border-black rounded-xl'
				>
					<h1 className='text-4xl'>Set time</h1>
					<div className='time' ref={time}>
						<div className='HH inline text-2xl' onMouseDown={timeClick}>
							00
						</div>
						<div className='seperator inline text-2xl'>:</div>
						<div className='mm inline text-2xl' onMouseDown={timeClick}>
							00
						</div>
						<div className='seperator inline text-2xl'>:</div>
						<div className='ss inline text-2xl' onMouseDown={timeClick}>
							15
						</div>
					</div>
					<p>Left- or Right-Click a button to increase or decrease the time.</p>
					<button
						className='bg-green-600 px-4 py-1 rounded-lg text-white'
						onClick={() => {
							closePopup();
							const timeText = `${time.current.textContent}`;
							const unix = moment(moment().unix()).add(timeText).format('X');
							setUnix(unix);
							start = moment().unix();
							setText(moment(unix, 'X').format('HH:mm:ss'));
							console.log(unix, start);
							timerStart();
						}}
					>
						Set Time & Start
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className='text-center overflow-hidden'>
			<motion.div
				initial={{
					y: 100,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
				transition={{
					ease: 'easeInOut',
					duration: 0.5,
				}}
			>
				<TimePopup />
				<h1 className='text-3xl'>BetterTimers</h1>
				<p>No timer set yet.</p>
				<button
					className='bg-gray-300 px-4 py-1 rounded-lg'
					ref={btn}
					onClick={() => {
						openPopup();
					}}
				>
					Set timer
				</button>
				<p>{text}</p>
				<div className='my-6' />
				<div className='w-[70vh] h-[70vh] mx-auto'>
					<CircularProgressbar
						value={val}
						styles={buildStyles({
							strokeLinecap: 'round',
							pathColor: col,
							pathTransitionDuration: 0.5,
						})}
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default App;
