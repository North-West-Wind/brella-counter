import { useState } from "react";
import "./About.css";
import { multiPartialRandomColor } from "../helper/color";

function About() {
	const [colors] = useState(multiPartialRandomColor(5));

	return <div className="about">
		<h3>What is this?</h3>
		<p>
			Welcome to NorthWestWind's Brella Counter. This is where I count how many Brella players I have encountered in Splatoon 3.
			They are so rare and precious, so I must cherish every one of my encounters.
		</p>
		<p>
			<span style={{ color: colors[0] }}>At the top of the page is today's Brella rate. </span> 
			As I play at least 2 hours of Splatoon 3 every day on stream, I would like to know how many Brella players I have seen today.
			The "rate" is simply the amount of Brella players divided by the amount of games of the day. Note that this is not counting myself.
			<span style={{ color: colors[1] }}> Next line is the total count of Brella players I have matched with and games I have played. </span>
			<span style={{ color: colors[2] }}>Followed by that is on which team did those players appear on. </span>
			The 4 columns after that (or 4 rows on mobile) is the <span style={{ color: colors[3] }}>count of individual Brella types spotted.</span>
		</p>

		<h3>How is this possible?</h3>
		<p>
			I use stat.ink, and I have a program setup that automatically uploads my match results to the website.
			If you are interested in my profile, you can <a style={{ color: colors[4] }} href="https://stat.ink/@NorthWestWind/spl3">check it out here</a>.
			The backend behind this website is just adding new match data every 5 minutes, and the website will update accordingly.
		</p>
	</div>
}

export default About;