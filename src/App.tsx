import React from "react";
import "./styles/index.less";
import {
	ApiRequest,
	TRIGGER_ID,
} from "@rocketman-system/streamkit-widget-helper";

const audio = new Audio(require('./media/freeze.mp3').default);
const img = require('./media/FreezyScreen.svg').default;

export const App = React.memo(() => {
	const [loaded, setLoaded] = React.useState(false);
	const [data, setData] = React.useState<{
		/** ID of the effect these data belong to */
		effectId: string;
		/** Unique ID of this trigger */
		triggerId: string;
		/** How long to display the effect (in seconds) */
		seconds: number;
		/** Effect volume level (0-100) */
		volume: number;
		/** Name of the effect sender */
		name?: string;
		/** Message from the sender */
		message?: string;
		/** Donation amount (if donation)
		 * @example 100 USD
		 */
		amount?: string;
	}>();
	const [screenshot, setScreenshot] = React.useState<string>();
	const [filter, setFilter] = React.useState(false);

    React.useEffect(() => {
      const tm = setTimeout(() => {
        setFilter(true);
      }, 100);

      return () => {
        clearTimeout(tm);
      };
    }, []);

	React.useEffect(() => {
		ApiRequest("GET", "private/effect/loadData", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setData(data);
			setLoaded(true);
		});

		ApiRequest("GET", "private/screen/screenshot", {
			triggerId: TRIGGER_ID,
		}).then((data) => {
			setScreenshot(data);
		});
	}, []);

	React.useEffect(() => {
		if (!loaded || !data?.volume) return;
		audio.currentTime = 0;
		audio.play();
		audio.autoplay = true;
		audio.volume = data.volume / 100;

		audio.onended = () => {
			audio.currentTime = 13.31;
			audio.play();
		};

		return () => {
			audio.pause();
		};
	}, [loaded, data]);

	if (!loaded || !screenshot) return <></>;

	return (
      <>
        <div className={'FreezeScreenShot'}>
			<img className="screen" src={screenshot} />
			<img className="frame" src={img} />
			<div className={filter ? 'filter' : ''}></div>
		</div>
      </>
    );
});