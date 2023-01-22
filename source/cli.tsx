#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	termrace
		visualize the 0xmonaco log in the terminal

	Usage
	  $ termrace

	Options
		--log  Path to racelog

	Examples
	  $ termrace --log=../logs/gameLog.json
`,
	{
		flags: {
			log: {
				type: "string",
			},
			delay: {
				type: "number",
			},
			width: {
				type: "number",
			},
		},
	}
);

render(
	<App log={cli.flags.log} delay={cli.flags.delay} width={cli.flags.width} />
);
