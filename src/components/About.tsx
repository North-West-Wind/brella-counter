import "./About.css";
import { useColors } from "../hooks/useColors";

function About() {
	const colors = useColors(16);

	return <div className="about">
		<h3>What is this?</h3>
		<p>
			Welcome to NorthWestWind's Brella Counter. This is where I count how many Brella players I have encountered in Splatoon 3.
			They are so rare and precious, so I must cherish every one of my encounters.
		</p>
		<p>
			<span className="colored" style={{ color: colors[0] }}>At the top of the page is today's Brella rate. </span> 
			As I play at least 2 hours of Splatoon 3 every day on stream, I would like to know how many Brella players I have seen today.
			The "rate" is simply the amount of Brella players divided by the amount of games of the day. Note that this is not counting myself.
			The 4 columns after that (or 4 rows on mobile) is the <span className="colored" style={{ color: colors[1] }}>count of individual Brella types spotted.</span>
			<span className="colored" style={{ color: colors[2] }}> Followed by that is the total count of Brella players I have matched with and games I have played, </span>
			and <span className="colored" style={{ color: colors[3] }}>how many of them appeared on which team.</span>
		</p>

		<h3>How is this possible?</h3>
		<p>
			I use stat.ink, and I have a program setup that automatically uploads my match results to the website.
			If you are interested in my profile, you can <a className="colored" style={{ color: colors[4] }} href="https://stat.ink/@NorthWestWind/spl3">check it out here</a>.
			The backend behind this website is just adding new match data every 5 minutes, and the website will update accordingly.
		</p>

		<h3>Who is she?</h3>
		<div className="flex vcenter">
			<img src="/random-integrelle" />
			<p>
				You mean her? This is <span className="colored" style={{ color: colors[5] }}>Integrelle</span>! Our beloved Brella-playing inkling girl.
			</p>
		</div>

		<h3>I want more!</h3>
		<p>
			This website is <span className="colored" style={{ color: colors[6] }}>open source</span>!
			Feel free to look at the source code on GitHub: <a className="colored" style={{ color: colors[15] }} href="https://github.com/North-West-Wind/brella-counter">https://github.com/North-West-Wind/brella-counter</a>
		</p>

		<p>
			I also stream Splatoon 3 every day! Check out my <a className="colored" style={{ color: colors[14] }} href="https://twitch.tv/northwestwindnww">Twitch channel</a> :&gt;.<br />
			Here are some ways you can reach me: 
			<ul>
				<li><a className="colored" style={{ color: colors[7] }} href="https://blog.northwestw.in/">Blog</a></li>
				<li><a className="colored" style={{ color: colors[8] }} href="https://discord.gg/srV8JfV">Discord</a></li>
				<li><a className="colored" style={{ color: colors[9] }} href="https://www.northwestw.in/">Elevator (Cool Website)</a></li>
				<li><a className="colored" style={{ color: colors[10] }} href="https://wetdry.world/@NorthWestWind">Mastodon</a></li>
				<li><a className="colored" style={{ color: colors[11] }} href="https://matrix.to/#/#northwestwind:matrix.northwestw.in">Matrix</a></li>
				<li><a className="colored" style={{ color: colors[12] }} href="https://twitch.tv/northwestwindnww">Twitch</a></li>
				<li><a className="colored" style={{ color: colors[13] }} href="https://www.youtube.com/c/NorthWestWind">YouTube</a></li>
			</ul>
		</p>
	</div>
}

export default About;