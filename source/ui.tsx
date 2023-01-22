import React, { FC, useState, useEffect } from "react";
import { Text, Box } from "ink";
import fs from "fs";

const trees1 = Array(1001)
	.fill(" ")
	.map(() => (Math.random() < 0.04 ? "🌲" : " ")) as string[];
const trees2 = Array(1001)
	.fill(" ")
	.map(() => (Math.random() < 0.04 ? "🌲" : " ")) as string[];
const road = Array(1001)
	.fill(" ")
	.map((_, idx) => (idx % 2 == 0 ? "—" : " ")) as string[];

const Landscape: FC<{
	trees: string[];
	trackStart: number;
	trackEnd: number;
}> = ({ trees, trackStart, trackEnd }) => {
	return (
		<Box width="100%" height={1} alignItems="flex-start">
			<Box width={24} marginRight={1}>
				<Text></Text>
			</Box>
			<Text>{trees.slice(trackStart, trackEnd)}</Text>
		</Box>
	);
};

const Road: FC<{
	trackStart: number;
	trackEnd: number;
}> = ({ trackStart, trackEnd }) => {
	return (
		<Box width="100%" height={1} alignItems="flex-start">
			<Box width={24} marginRight={1}>
				<Text></Text>
			</Box>
			<Text color="#555555">{road.slice(trackStart, trackEnd)}</Text>
		</Box>
	);
};

const Car: FC<{
	name: string;
	y: number;
	actions: number[];
	trackStart: number;
	trackEnd: number;
}> = ({ name, y, actions, trackStart, trackEnd }) => {
	const pos = Array(1001).fill(" ") as string[];
	pos[Math.min(pos.length - 1, y)] = "🏎️";
	const track = pos.slice(trackStart, trackEnd + 1);

	// ACCELERATE,
	// SHELL,
	// SUPER_SHELL,
	// BANANA,
	// SHIELD
	const abilityTypes = ["🏃", "🐢", "🐢", "🍌", "🛡️"];
	const abilities = actions.map((v: number, i: number) =>
		v > 0 ? abilityTypes[i] : ""
	);
	const flag = y >= 1000 ? "  🏁" : "";
	return (
		<Box width="100%" height={1} alignItems="flex-start">
			<Box width={24} marginRight={1}>
				<Text>
					{name} {abilities}
				</Text>
			</Box>
			<Text>
				{track} {flag}
			</Text>
		</Box>
	);
};

const App: FC<{ log?: string; delay?: number; width?: number }> = ({
	log = "../logs/gameLog.json",
	delay = 100,
	width = 100,
}) => {
	const data = JSON.parse(fs.readFileSync(log).toString());
	const [turn, setTurn] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setTurn((prevTurn) => {
				if (!data.turns[prevTurn + 1]) {
					clearInterval(timer);
					return prevTurn;
				}
				return Math.min(prevTurn + 1);
			});
		}, delay);

		return () => {
			console.log("clearTimer");
			clearInterval(timer);
		};
	}, []);

	const turnData = data.turns[turn];

	const screenWidth = width;
	const winnerPos = Math.max(...turnData.y);
	const trackStart = Math.min(
		Math.max(winnerPos - screenWidth / 2, 0),
		1000 - screenWidth
	);
	const trackEnd = Math.max(
		Math.min(winnerPos + screenWidth / 2, 1000),
		screenWidth
	);

	return (
		<Box width="100%" flexDirection="column">
			<Box width="100%" flexDirection="column">
				<Landscape trees={trees1} trackStart={trackStart} trackEnd={trackEnd} />
				<Road trackStart={trackStart} trackEnd={trackEnd} />
				{data.carNames.map((name: string, idx: number) => (
					<Box key={idx} width="100%" flexDirection="column">
						<Car
							name={name}
							y={turnData.y[idx]}
							actions={turnData.currentCar == idx ? turnData.usedAbilities : []}
							trackStart={trackStart}
							trackEnd={trackEnd}
						/>
						<Road trackStart={trackStart} trackEnd={trackEnd} />
					</Box>
				))}
				<Landscape trees={trees2} trackStart={trackStart} trackEnd={trackEnd} />
			</Box>
			<Text>Turn: {turn}</Text>
		</Box>
	);
};

module.exports = App;
export default App;

//                                            |             screen                 |
//                                            |               |                    |
// [======>================================================================================================================]
// [==========================================================>============================================================]
// [=======================================================>===============================================================]
