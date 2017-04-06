# CTA Magic Mirror Module
This is a module for pulling CTA Train data for your magic mirror.
This utilizes MagicMirror² - https://github.com/MichMich/MagicMirror

## Configuration

Inside your configuration file (./config/config.js) is where you will put all of the configuration you need for this module

Here is the structure:
````javascript
{
	module: 'ctatrain',
	position: 'POSITION ON MIRROR', //example: bottom_bar
	config: {
		apikey: 'YOURCTAAPIKEY',
		stpid: [] // an array of stop ids
	}
}
````

This is the bare minimum that you will need to configure for the CTA Train module to work.

There are addition features you may utilize
````javascript
{
	[...]
	config: {
		[...]
		max: 0,
		maxPerStop: 0,
		minuteDelay: 0
	}
}
````

max - will limit the total output you will allow to be displayed on the screen

maxPerStop - to be used if you have multiple stops, but want to limit how many you are wanting to display at any given time.

minuteDelay - defaults to 0, this will create a buffer of minutes for the earliest train to be displayed on the screen. For example: it takes you 5 minutes to walk to the CTA. Well, you don't need to display trains that are just about to arrive. If you put in 5 for the minuteDelay, then it will only display trains that are expecting to arrive in 5 minutes or more. 